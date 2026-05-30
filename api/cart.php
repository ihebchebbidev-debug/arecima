<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        getCart($conn);
        break;
    case 'POST':
        addToCart($conn);
        break;
    case 'PUT':
        updateCartItem($conn);
        break;
    case 'DELETE':
        if (isset($_GET['clear'])) {
            clearCart($conn);
        } else {
            removeFromCart($conn);
        }
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getCart(PDO $conn): void {
    $customerId = requireValidId($_GET['customer_id'] ?? '', 'customer_id');

    $stmt = $conn->prepare(
        "SELECT ci.*, p.name_fr, p.name_en, p.price, p.original_price, p.slug, p.stock, p.is_active,
            (SELECT url FROM aurelia_product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) AS image
         FROM aurelia_cart_items ci
         INNER JOIN aurelia_products p ON ci.product_id = p.id
         WHERE ci.customer_id = ?
         ORDER BY ci.created_at"
    );
    $stmt->execute([$customerId]);
    $items = $stmt->fetchAll();

    $subtotal = 0;
    foreach ($items as &$item) {
        $item['line_total'] = (float)$item['price'] * (int)$item['quantity'];
        $subtotal += $item['line_total'];
    }

    jsonResponse(['success' => true, 'data' => ['items' => $items, 'subtotal' => $subtotal, 'count' => count($items)]]);
}

function addToCart(PDO $conn): void {
    $data = getRequestBody();
    $customerId = requireValidId($data['customer_id'] ?? '', 'customer_id');
    $productId = requireValidId($data['product_id'] ?? '', 'product_id');
    $qty = max(1, min(99, (int)($data['quantity'] ?? 1)));

    $check = $conn->prepare('SELECT id, stock, is_active FROM aurelia_products WHERE id = ?');
    $check->execute([$productId]);
    $product = $check->fetch();
    if (!$product || !(int)$product['is_active']) {
        jsonResponse(['success' => false, 'error' => 'Product not available'], 404);
    }
    if ((int)$product['stock'] < $qty) {
        jsonResponse(['success' => false, 'error' => 'Insufficient stock'], 409);
    }

    $conn->prepare(
        'INSERT INTO aurelia_cart_items (id, customer_id, product_id, quantity)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE quantity = LEAST(quantity + VALUES(quantity), 99), updated_at = NOW()'
    )->execute([generateId(), $customerId, $productId, $qty]);

    jsonResponse(['success' => true, 'message' => 'Added to cart'], 201);
}

function updateCartItem(PDO $conn): void {
    $data = getRequestBody();
    $customerId = requireValidId($data['customer_id'] ?? '', 'customer_id');
    $productId = requireValidId($data['product_id'] ?? '', 'product_id');
    $qty = (int)($data['quantity'] ?? 0);

    if ($qty <= 0) {
        $conn->prepare('DELETE FROM aurelia_cart_items WHERE customer_id = ? AND product_id = ?')
            ->execute([$customerId, $productId]);
    } else {
        $qty = min(99, $qty);
        $conn->prepare(
            'UPDATE aurelia_cart_items SET quantity = ?, updated_at = NOW() WHERE customer_id = ? AND product_id = ?'
        )->execute([$qty, $customerId, $productId]);
    }

    jsonResponse(['success' => true, 'message' => 'Cart updated']);
}

function removeFromCart(PDO $conn): void {
    $customerId = requireValidId($_GET['customer_id'] ?? '', 'customer_id');
    $productId = requireValidId($_GET['product_id'] ?? '', 'product_id');
    $conn->prepare('DELETE FROM aurelia_cart_items WHERE customer_id = ? AND product_id = ?')
        ->execute([$customerId, $productId]);
    jsonResponse(['success' => true, 'message' => 'Removed from cart']);
}

function clearCart(PDO $conn): void {
    $customerId = requireValidId($_GET['customer_id'] ?? '', 'customer_id');
    $conn->prepare('DELETE FROM aurelia_cart_items WHERE customer_id = ?')->execute([$customerId]);
    jsonResponse(['success' => true, 'message' => 'Cart cleared']);
}
