<?php
/**
 * Public tracking config for storefront (Facebook Pixel, etc.)
 * No auth — only non-sensitive, enabled flags are returned.
 */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

$conn = getDB();
$stmt = $conn->prepare('SELECT value FROM aurelia_settings WHERE `key` = ?');
$stmt->execute(['facebook_pixel']);
$row = $stmt->fetch();

$defaults = [
    'enabled' => false,
    'pixel_id' => '',
    'track_page_view' => true,
    'track_view_content' => true,
    'track_add_to_cart' => true,
    'track_initiate_checkout' => true,
    'track_purchase' => true,
    'track_add_to_wishlist' => true,
    'test_event_code' => '',
];

$config = $defaults;
if ($row) {
    $decoded = json_decode($row['value'], true);
    if (is_array($decoded)) {
        $config = array_merge($defaults, $decoded);
    }
}

$pixelId = preg_replace('/\D/', '', (string)($config['pixel_id'] ?? ''));

if (empty($config['enabled']) || strlen($pixelId) < 15) {
    jsonResponse(['success' => true, 'data' => ['enabled' => false]]);
}

$testCode = trim((string)($config['test_event_code'] ?? ''));

jsonResponse(['success' => true, 'data' => [
    'enabled' => true,
    'pixel_id' => $pixelId,
    'track_page_view' => !empty($config['track_page_view']),
    'track_view_content' => !empty($config['track_view_content']),
    'track_add_to_cart' => !empty($config['track_add_to_cart']),
    'track_initiate_checkout' => !empty($config['track_initiate_checkout']),
    'track_purchase' => !empty($config['track_purchase']),
    'track_add_to_wishlist' => !empty($config['track_add_to_wishlist']),
    'test_event_code' => $testCode !== '' ? $testCode : null,
]]);
