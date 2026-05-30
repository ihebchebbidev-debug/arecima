<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        getFavorites($conn);
        break;
    case 'POST':
        addFavorite($conn);
        break;
    case 'DELETE':
        removeFavorite($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getFavorites(PDO $conn): void {
    $customerId = requireValidId($_GET['customer_id'] ?? '', 'customer_id');

    $stmt = $conn->prepare(
        "SELECT f.product_id, f.created_at, p.name_fr, p.name_en, p.price, p.original_price, p.slug,
            (SELECT url FROM aurelia_product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) AS image
         FROM aurelia_favorites f
         INNER JOIN aurelia_products p ON f.product_id = p.id AND p.is_active = 1
         WHERE f.customer_id = ?
         ORDER BY f.created_at DESC"
    );
    $stmt->execute([$customerId]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function addFavorite(PDO $conn): void {
    $data = getRequestBody();
    $customerId = requireValidId($data['customer_id'] ?? '', 'customer_id');
    $productId = requireValidId($data['product_id'] ?? '', 'product_id');

    $check = $conn->prepare('SELECT id FROM aurelia_products WHERE id = ? AND is_active = 1');
    $check->execute([$productId]);
    if (!$check->fetch()) {
        jsonResponse(['success' => false, 'error' => 'Product not found'], 404);
    }

    try {
        $conn->prepare('INSERT INTO aurelia_favorites (id, customer_id, product_id) VALUES (?, ?, ?)')
            ->execute([generateId(), $customerId, $productId]);
        jsonResponse(['success' => true, 'message' => 'Added to favorites'], 201);
    } catch (PDOException $e) {
        if ((int)($e->errorInfo[1] ?? 0) === 1062) {
            jsonResponse(['success' => true, 'message' => 'Already in favorites']);
        }
        jsonResponse(['success' => false, 'error' => 'Failed to add favorite'], 500);
    }
}

function removeFavorite(PDO $conn): void {
    $customerId = requireValidId($_GET['customer_id'] ?? '', 'customer_id');
    $productId = requireValidId($_GET['product_id'] ?? '', 'product_id');
    $conn->prepare('DELETE FROM aurelia_favorites WHERE customer_id = ? AND product_id = ?')
        ->execute([$customerId, $productId]);
    jsonResponse(['success' => true, 'message' => 'Removed from favorites']);
}
