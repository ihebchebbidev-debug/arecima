<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        authenticateAdmin();
        if (isset($_GET['key'])) {
            getSetting($conn, $_GET['key']);
        } else {
            getSettings($conn);
        }
        break;
    case 'PUT':
        updateSetting($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getSettings(PDO $conn): void {
    $stmt = $conn->query('SELECT * FROM aurelia_settings ORDER BY `key`');
    $settings = [];
    foreach ($stmt->fetchAll() as $row) {
        $decoded = json_decode($row['value'], true);
        $settings[$row['key']] = $decoded !== null ? $decoded : $row['value'];
    }
    jsonResponse(['success' => true, 'data' => $settings]);
}

function getSetting(PDO $conn, string $key): void {
    $stmt = $conn->prepare('SELECT * FROM aurelia_settings WHERE `key` = ?');
    $stmt->execute([$key]);
    $row = $stmt->fetch();
    if (!$row) {
        jsonResponse(['success' => false, 'error' => 'Setting not found'], 404);
    }
    $decoded = json_decode($row['value'], true);
    jsonResponse(['success' => true, 'data' => ['key' => $row['key'], 'value' => $decoded !== null ? $decoded : $row['value']]]);
}

function updateSetting(PDO $conn): void {
    $admin = authenticateAdmin();
    $data = getRequestBody();
    if (empty($data['key'])) {
        jsonResponse(['success' => false, 'error' => 'key required'], 400);
    }

    if ($data['key'] === 'facebook_pixel') {
        validateFacebookPixelSetting($data['value'] ?? []);
    }

    $value = json_encode($data['value'] ?? '', JSON_UNESCAPED_UNICODE);
    $stmt = $conn->prepare(
        'INSERT INTO aurelia_settings (id, `key`, value, updated_by)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE value = VALUES(value), updated_by = VALUES(updated_by), updated_at = NOW()'
    );
    $stmt->execute([generateId(), $data['key'], $value, $admin['id']]);
    jsonResponse(['success' => true, 'message' => 'Setting updated']);
}

function validateFacebookPixelSetting($value): void {
    if (!is_array($value)) {
        jsonResponse(['success' => false, 'error' => 'Invalid facebook_pixel value'], 400);
    }
    if (!empty($value['enabled'])) {
        $pixelId = preg_replace('/\D/', '', (string)($value['pixel_id'] ?? ''));
        if (strlen($pixelId) < 15 || strlen($pixelId) > 16) {
            jsonResponse(['success' => false, 'error' => 'Pixel ID must be 15–16 digits'], 400);
        }
    }
}
