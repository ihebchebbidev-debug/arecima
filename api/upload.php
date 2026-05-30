<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

authenticateAdmin();

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'error' => 'No file uploaded or upload error'], 400);
}

$file = $_FILES['file'];
$maxSize = 5 * 1024 * 1024;

if ($file['size'] > $maxSize) {
    jsonResponse(['success' => false, 'error' => 'File too large. Max 5MB'], 400);
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
if (!in_array($ext, $allowedExt, true)) {
    jsonResponse(['success' => false, 'error' => 'Invalid file type. Allowed: jpg, png, webp, gif, svg'], 400);
}

$uploadsDir = ensureUploadsDir();
$filename = 'arecima_' . uniqid('', true) . '.' . $ext;
$destination = $uploadsDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonResponse(['success' => false, 'error' => 'Upload failed — check folder permissions on api/uploads'], 500);
}

$url = getUploadUrl($filename);
$conn = getDB();

if (!empty($_POST['product_id'])) {
    $productId = requireValidId($_POST['product_id'], 'product_id');
    $isPrimary = !empty($_POST['is_primary']) ? 1 : 0;
    if ($isPrimary) {
        $conn->prepare('UPDATE aurelia_product_images SET is_primary = 0 WHERE product_id = ?')
            ->execute([$productId]);
    }
    $conn->prepare(
        'INSERT INTO aurelia_product_images (id, product_id, url, alt_text, sort_order, is_primary)
         VALUES (?, ?, ?, ?, ?, ?)'
    )->execute([
        generateId(),
        $productId,
        $url,
        $_POST['alt_text'] ?? null,
        isset($_POST['sort_order']) ? (int)$_POST['sort_order'] : 0,
        $isPrimary,
    ]);
}

jsonResponse(['success' => true, 'data' => ['url' => $url, 'filename' => $filename], 'message' => 'File uploaded'], 201);
