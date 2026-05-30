<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        $productId = $_GET['product_id'] ?? '';
        if ($productId === '') {
            jsonResponse(['success' => false, 'error' => 'product_id required'], 400);
        }
        $productId = requireValidId($productId, 'product_id');
        $stmt = $conn->prepare(
            'SELECT * FROM aurelia_product_images WHERE product_id = ? ORDER BY sort_order, created_at'
        );
        $stmt->execute([$productId]);
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        authenticateAdmin();
        $data = getRequestBody();
        if (empty($data['product_id']) || empty($data['url'])) {
            jsonResponse(['success' => false, 'error' => 'product_id and url required'], 400);
        }
        $productId = requireValidId($data['product_id'], 'product_id');
        $id = generateId();
        $isPrimary = !empty($data['is_primary']) ? 1 : 0;

        if ($isPrimary) {
            $conn->prepare('UPDATE aurelia_product_images SET is_primary = 0 WHERE product_id = ?')
                ->execute([$productId]);
        }

        $conn->prepare(
            'INSERT INTO aurelia_product_images (id, product_id, url, alt_text, sort_order, is_primary)
             VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([
            $id,
            $productId,
            $data['url'],
            $data['alt_text'] ?? null,
            (int)($data['sort_order'] ?? 0),
            $isPrimary,
        ]);
        jsonResponse(['success' => true, 'data' => ['id' => $id], 'message' => 'Image added'], 201);
        break;

    case 'PUT':
        authenticateAdmin();
        $data = getRequestBody();
        if (empty($data['id'])) {
            jsonResponse(['success' => false, 'error' => 'ID required'], 400);
        }
        $id = requireValidId($data['id'], 'image id');

        if (!empty($data['is_primary'])) {
            $imgStmt = $conn->prepare('SELECT product_id FROM aurelia_product_images WHERE id = ?');
            $imgStmt->execute([$id]);
            $img = $imgStmt->fetch();
            if ($img) {
                $conn->prepare('UPDATE aurelia_product_images SET is_primary = 0 WHERE product_id = ?')
                    ->execute([$img['product_id']]);
            }
        }

        $fields = [];
        $values = [];
        foreach (['url', 'alt_text', 'sort_order', 'is_primary'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $values[] = $data[$f];
            }
        }
        if (empty($fields)) {
            jsonResponse(['success' => false, 'error' => 'No fields'], 400);
        }
        $values[] = $id;
        $conn->prepare('UPDATE aurelia_product_images SET ' . implode(', ', $fields) . ' WHERE id = ?')
            ->execute($values);
        jsonResponse(['success' => true, 'message' => 'Image updated']);
        break;

    case 'DELETE':
        authenticateAdmin();
        $id = requireValidId($_GET['id'] ?? '', 'image id');
        $stmt = $conn->prepare('DELETE FROM aurelia_product_images WHERE id = ?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) {
            jsonResponse(['success' => false, 'error' => 'Image not found'], 404);
        }
        jsonResponse(['success' => true, 'message' => 'Image deleted']);
        break;

    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}
