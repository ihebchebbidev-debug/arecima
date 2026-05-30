<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        if (!empty($_GET['country'])) {
            getShippingForCountry($conn, trim($_GET['country']));
        } else {
            authenticateAdmin();
            getShippingZones($conn);
        }
        break;
    case 'POST':
        createZone($conn);
        break;
    case 'PUT':
        updateZone($conn);
        break;
    case 'DELETE':
        deleteZone($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getShippingZones(PDO $conn): void {
    $stmt = $conn->query('SELECT * FROM aurelia_shipping_zones ORDER BY name');
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getShippingForCountry(PDO $conn, string $country): void {
    $stmt = $conn->prepare(
        "SELECT * FROM aurelia_shipping_zones
         WHERE is_active = 1 AND (FIND_IN_SET(?, countries) OR countries LIKE ?)"
    );
    $stmt->execute([$country, '%' . $country . '%']);
    $zones = $stmt->fetchAll();

    if (empty($zones)) {
        jsonResponse(['success' => true, 'data' => [[
            'name' => 'Default',
            'base_cost' => 7,
            'free_threshold' => 150,
            'countries' => $country,
        ]]]);
    }

    jsonResponse(['success' => true, 'data' => $zones]);
}

function createZone(PDO $conn): void {
    authenticateAdmin();
    $data = getRequestBody();
    if (empty($data['name'])) {
        jsonResponse(['success' => false, 'error' => 'name required'], 400);
    }

    $countries = is_array($data['countries'] ?? null)
        ? implode(',', $data['countries'])
        : (string)($data['countries'] ?? '');

    $id = generateId();
    $conn->prepare(
        'INSERT INTO aurelia_shipping_zones (id, name, countries, base_cost, free_threshold, estimated_days_min, estimated_days_max, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        $id,
        trim($data['name']),
        $countries,
        (float)($data['base_cost'] ?? 0),
        isset($data['free_threshold']) ? (float)$data['free_threshold'] : null,
        isset($data['estimated_days_min']) ? (int)$data['estimated_days_min'] : null,
        isset($data['estimated_days_max']) ? (int)$data['estimated_days_max'] : null,
        (int)($data['is_active'] ?? 1),
    ]);

    jsonResponse(['success' => true, 'data' => ['id' => $id], 'message' => 'Zone created'], 201);
}

function updateZone(PDO $conn): void {
    authenticateAdmin();
    $data = getRequestBody();
    if (empty($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'ID required'], 400);
    }
    $id = requireValidId($data['id'], 'zone id');

    $fields = [];
    $values = [];
    $allowed = ['name', 'countries', 'base_cost', 'free_threshold', 'estimated_days_min', 'estimated_days_max', 'is_active'];
    foreach ($allowed as $f) {
        if (!array_key_exists($f, $data)) {
            continue;
        }
        $val = $data[$f];
        if ($f === 'countries' && is_array($val)) {
            $val = implode(',', $val);
        }
        $fields[] = "$f = ?";
        $values[] = $val;
    }
    if (empty($fields)) {
        jsonResponse(['success' => false, 'error' => 'No fields'], 400);
    }
    $values[] = $id;
    $conn->prepare('UPDATE aurelia_shipping_zones SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);
    jsonResponse(['success' => true, 'message' => 'Zone updated']);
}

function deleteZone(PDO $conn): void {
    authenticateAdmin();
    $id = requireValidId($_GET['id'] ?? '', 'zone id');
    $stmt = $conn->prepare('DELETE FROM aurelia_shipping_zones WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'error' => 'Zone not found'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Zone deleted']);
}
