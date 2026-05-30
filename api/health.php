<?php
/**
 * Quick deploy check — open in browser: /arecima/api/health.php
 */
require_once __DIR__ . '/config.php';

$checks = ['api' => 'ok', 'php' => PHP_VERSION];

try {
    $conn = getDB();
    $checks['database'] = 'connected';
    $checks['tables'] = [
        'products' => tableExists($conn, 'aurelia_products'),
        'orders' => tableExists($conn, 'aurelia_orders'),
        'admin_users' => tableExists($conn, 'aurelia_admin_users'),
    ];
    $checks['product_count'] = (int)$conn->query('SELECT COUNT(*) FROM aurelia_products')->fetchColumn();
} catch (Throwable $e) {
    $checks['database'] = 'error';
    $checks['error'] = APP_DEBUG ? $e->getMessage() : 'Connection failed — set config.local.php';
}

$uploads = __DIR__ . '/uploads';
$checks['uploads_writable'] = is_dir($uploads) ? is_writable($uploads) : @mkdir($uploads, 0755, true);

jsonResponse(['success' => true, 'data' => $checks]);
