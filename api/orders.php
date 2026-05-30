<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getOrder($conn, requireValidId($_GET['id'], 'order id'));
        } else {
            getOrders($conn);
        }
        break;
    case 'POST':
        createOrder($conn);
        break;
    case 'PUT':
        updateOrder($conn);
        break;
    case 'PATCH':
        updateOrderStatus($conn);
        break;
    case 'DELETE':
        deleteOrder($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getOrders(PDO $conn): void {
    authenticateAdmin();
    $where = 'WHERE 1=1';
    $params = [];

    if (!empty($_GET['status'])) {
        assertOrderStatus($_GET['status']);
        $where .= ' AND o.status = ?';
        $params[] = $_GET['status'];
    }
    if (!empty($_GET['payment_status'])) {
        assertPaymentStatus($_GET['payment_status']);
        $where .= ' AND o.payment_status = ?';
        $params[] = $_GET['payment_status'];
    }
    if (!empty($_GET['customer_id'])) {
        $where .= ' AND o.customer_id = ?';
        $params[] = requireValidId($_GET['customer_id'], 'customer_id');
    }
    if (!empty($_GET['search'])) {
        $where .= ' AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ?)';
        $s = '%' . mb_substr(trim($_GET['search']), 0, 100) . '%';
        $params[] = $s;
        $params[] = $s;
        $params[] = $s;
    }
    if (!empty($_GET['date_from'])) {
        $where .= ' AND o.created_at >= ?';
        $params[] = $_GET['date_from'];
    }
    if (!empty($_GET['date_to'])) {
        $where .= ' AND o.created_at <= ?';
        $params[] = $_GET['date_to'] . ' 23:59:59';
    }

    $sort = $_GET['sort'] ?? 'created_at';
    $order = (isset($_GET['order']) && strtoupper($_GET['order']) === 'ASC') ? 'ASC' : 'DESC';
    $allowedSorts = ['created_at', 'total', 'order_number', 'status'];
    if (!in_array($sort, $allowedSorts, true)) {
        $sort = 'created_at';
    }

    $query = "SELECT o.* FROM aurelia_orders o $where ORDER BY o.$sort $order";
    $countQuery = "SELECT COUNT(*) FROM aurelia_orders o $where";

    $result = paginate($query, $countQuery, $params, $conn);
    jsonResponse(['success' => true, 'data' => $result['items'], 'pagination' => $result['pagination']]);
}

function getOrder(PDO $conn, string $id): void {
    authenticateAdmin();
    $stmt = $conn->prepare('SELECT * FROM aurelia_orders WHERE id = ?');
    $stmt->execute([$id]);
    $order = $stmt->fetch();
    if (!$order) {
        jsonResponse(['success' => false, 'error' => 'Order not found'], 404);
    }

    $itemStmt = $conn->prepare(
        "SELECT oi.*,
            (SELECT url FROM aurelia_product_images WHERE product_id = oi.product_id AND is_primary = 1 LIMIT 1) AS product_image
         FROM aurelia_order_items oi WHERE oi.order_id = ?"
    );
    $itemStmt->execute([$id]);
    $order['items'] = $itemStmt->fetchAll();

    $timeStmt = $conn->prepare(
        "SELECT t.*, a.full_name AS created_by_name
         FROM aurelia_order_timeline t
         LEFT JOIN aurelia_admin_users a ON t.created_by = a.id
         WHERE t.order_id = ? ORDER BY t.created_at DESC"
    );
    $timeStmt->execute([$id]);
    $order['timeline'] = $timeStmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $order]);
}

function computeShipping(PDO $conn, float $subtotal, ?string $country): float {
    if ($country) {
        $stmt = $conn->prepare(
            "SELECT base_cost, free_threshold FROM aurelia_shipping_zones
             WHERE is_active = 1 AND (FIND_IN_SET(?, countries) OR countries LIKE ?)
             LIMIT 1"
        );
        $stmt->execute([$country, '%' . $country . '%']);
        $zone = $stmt->fetch();
        if ($zone) {
            $threshold = $zone['free_threshold'] !== null ? (float)$zone['free_threshold'] : null;
            if ($threshold !== null && $subtotal >= $threshold) {
                return 0.0;
            }
            return (float)$zone['base_cost'];
        }
    }
    return $subtotal >= 150 ? 0.0 : 7.0;
}

function createOrder(PDO $conn): void {
    $data = getRequestBody();

    foreach (['customer_name', 'customer_email', 'customer_phone'] as $f) {
        if (empty(trim((string)($data[$f] ?? '')))) {
            jsonResponse(['success' => false, 'error' => "'$f' is required"], 400);
        }
    }

    if (empty($data['items']) || !is_array($data['items'])) {
        jsonResponse(['success' => false, 'error' => 'Cart is empty'], 400);
    }

    if (count($data['items']) > 50) {
        jsonResponse(['success' => false, 'error' => 'Too many items in order'], 400);
    }

    $email = trim($data['customer_email']);
    if (!validateEmail($email)) {
        jsonResponse(['success' => false, 'error' => 'Invalid email'], 400);
    }

    $phone = trim((string)$data['customer_phone']);
    if (strlen(preg_replace('/\D/', '', $phone)) < 8) {
        jsonResponse(['success' => false, 'error' => 'Invalid phone number'], 400);
    }

    $id = generateId();
    $orderNumber = 'AUR-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));

    $conn->beginTransaction();
    try {
        $subtotal = 0;
        $resolvedItems = [];
        $productStmt = $conn->prepare(
            'SELECT id, name_fr, name_en, sku, price, stock, is_active
             FROM aurelia_products WHERE id = ? FOR UPDATE'
        );

        foreach ($data['items'] as $raw) {
            $pid = $raw['product_id'] ?? null;
            $qty = max(1, min(99, (int)($raw['quantity'] ?? 1)));
            if (!$pid || !isValidId((string)$pid)) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => 'Missing or invalid product id'], 400);
            }
            $pid = strtolower((string)$pid);

            $productStmt->execute([$pid]);
            $product = $productStmt->fetch();
            if (!$product) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => 'Product not found'], 400);
            }
            if (!(int)$product['is_active']) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => "Product unavailable: {$product['name_fr']}"], 400);
            }
            if ((int)$product['stock'] < $qty) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => "Insufficient stock for {$product['name_fr']}"], 409);
            }

            $unit = (float)$product['price'];
            $line = $unit * $qty;
            $subtotal += $line;
            $resolvedItems[] = [
                'product_id' => $product['id'],
                'product_name' => $product['name_fr'] ?: $product['name_en'],
                'product_sku' => $product['sku'],
                'quantity' => $qty,
                'unit_price' => $unit,
                'total' => $line,
            ];
        }

        $country = $data['shipping_country'] ?? 'Tunisia';
        $shipping = computeShipping($conn, $subtotal, $country);

        $discount = 0;
        $couponCode = null;
        $couponRow = null;
        if (!empty($data['coupon_code'])) {
            $code = strtoupper(trim($data['coupon_code']));
            $cStmt = $conn->prepare('SELECT * FROM aurelia_coupons WHERE code = ? AND is_active = 1 FOR UPDATE');
            $cStmt->execute([$code]);
            $couponRow = $cStmt->fetch();
            if (!$couponRow) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => 'Invalid coupon'], 400);
            }
            if ($couponRow['expires_at'] && strtotime($couponRow['expires_at']) < time()) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => 'Coupon expired'], 400);
            }
            if ($couponRow['starts_at'] && strtotime($couponRow['starts_at']) > time()) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => 'Coupon not yet active'], 400);
            }
            if ($couponRow['max_uses'] !== null && (int)$couponRow['used_count'] >= (int)$couponRow['max_uses']) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => 'Coupon usage limit reached'], 400);
            }
            if ($couponRow['min_order_amount'] !== null && $subtotal < (float)$couponRow['min_order_amount']) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => 'Order below minimum for this coupon'], 400);
            }
            $type = $couponRow['discount_type'];
            $value = (float)$couponRow['discount_value'];
            $discount = ($type === 'percentage' || $type === 'percent')
                ? $subtotal * ($value / 100)
                : $value;
            $discount = min($discount, $subtotal);
            $couponCode = $code;
        }

        $tax = 0;
        $total = max(0, $subtotal + $shipping - $discount + $tax);

        $customerId = !empty($data['customer_id']) ? requireValidId($data['customer_id'], 'customer_id') : null;
        if (!$customerId) {
            $findStmt = $conn->prepare('SELECT id FROM aurelia_customers WHERE email = ? LIMIT 1');
            $findStmt->execute([$email]);
            $existing = $findStmt->fetch();
            if ($existing) {
                $customerId = $existing['id'];
            } else {
                $parts = preg_split('/\s+/', trim($data['customer_name']), 2);
                $first = $parts[0] ?? $data['customer_name'];
                $last = $parts[1] ?? '';
                $customerId = generateId();
                $conn->prepare(
                    'INSERT INTO aurelia_customers
                    (id, email, first_name, last_name, phone, country, city, address, postal_code, is_subscribed)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)'
                )->execute([
                    $customerId,
                    $email,
                    $first,
                    $last,
                    $phone,
                    $data['shipping_country'] ?? null,
                    $data['shipping_city'] ?? null,
                    $data['shipping_address'] ?? null,
                    $data['shipping_postal_code'] ?? null,
                ]);
            }
        }

        $paymentMethod = in_array($data['payment_method'] ?? 'cod', ['cod', 'card', 'transfer'], true)
            ? $data['payment_method']
            : 'cod';

        $stmt = $conn->prepare(
            "INSERT INTO aurelia_orders
            (id, order_number, customer_id, customer_name, customer_email, customer_phone,
             status, payment_status, payment_method,
             subtotal, shipping, discount, tax, total,
             shipping_address, shipping_city, shipping_country, shipping_postal_code,
             coupon_code, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $id,
            $orderNumber,
            $customerId,
            trim($data['customer_name']),
            $email,
            $phone,
            'pending',
            'pending',
            $paymentMethod,
            $subtotal,
            $shipping,
            $discount,
            $tax,
            $total,
            isset($data['shipping_address']) ? trim($data['shipping_address']) : null,
            $data['shipping_city'] ?? null,
            $country,
            $data['shipping_postal_code'] ?? null,
            $couponCode,
            isset($data['notes']) ? mb_substr(trim($data['notes']), 0, 2000) : null,
        ]);

        $itemStmt = $conn->prepare(
            'INSERT INTO aurelia_order_items
            (id, order_id, product_id, product_name, product_sku, quantity, unit_price, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stockStmt = $conn->prepare(
            'UPDATE aurelia_products SET stock = stock - ? WHERE id = ? AND stock >= ?'
        );

        foreach ($resolvedItems as $it) {
            $itemStmt->execute([
                generateId(),
                $id,
                $it['product_id'],
                $it['product_name'],
                $it['product_sku'],
                $it['quantity'],
                $it['unit_price'],
                $it['total'],
            ]);
            $stockStmt->execute([$it['quantity'], $it['product_id'], $it['quantity']]);
            if ($stockStmt->rowCount() === 0) {
                $conn->rollBack();
                jsonResponse(['success' => false, 'error' => "Stock changed during checkout for {$it['product_name']}"], 409);
            }
        }

        if ($couponRow) {
            $conn->prepare('UPDATE aurelia_coupons SET used_count = used_count + 1 WHERE id = ?')
                ->execute([$couponRow['id']]);
        }

        $conn->prepare('INSERT INTO aurelia_order_timeline (id, order_id, status, note) VALUES (?, ?, ?, ?)')
            ->execute([generateId(), $id, 'pending', 'Commande créée']);

        if ($customerId) {
            $conn->prepare(
                'UPDATE aurelia_customers
                 SET total_orders = total_orders + 1, total_spent = total_spent + ?, last_order_at = NOW(), updated_at = NOW()
                 WHERE id = ?'
            )->execute([$total, $customerId]);
        }

        $conn->commit();
        jsonResponse([
            'success' => true,
            'data' => [
                'id' => $id,
                'order_number' => $orderNumber,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'discount' => $discount,
                'total' => $total,
            ],
            'message' => 'Order created',
        ], 201);
    } catch (Throwable $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        error_log('createOrder: ' . $e->getMessage());
        jsonResponse([
            'success' => false,
            'error' => APP_DEBUG ? $e->getMessage() : 'Failed to create order',
        ], 500);
    }
}

function restoreOrderStock(PDO $conn, string $orderId): void {
    $items = $conn->prepare('SELECT product_id, quantity FROM aurelia_order_items WHERE order_id = ? AND product_id IS NOT NULL');
    $items->execute([$orderId]);
    $restore = $conn->prepare('UPDATE aurelia_products SET stock = stock + ? WHERE id = ?');
    foreach ($items->fetchAll() as $row) {
        $restore->execute([(int)$row['quantity'], $row['product_id']]);
    }
}

function updateOrder(PDO $conn): void {
    requireManager();
    $data = getRequestBody();
    if (empty($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'Order ID required'], 400);
    }
    $id = requireValidId($data['id'], 'order id');

    $fields = [];
    $values = [];
    $allowed = [
        'customer_name', 'customer_email', 'customer_phone', 'payment_method',
        'shipping_address', 'shipping_city', 'shipping_country', 'shipping_postal_code',
        'tracking_number', 'notes',
    ];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $data)) {
            $fields[] = "$f = ?";
            $values[] = $data[$f];
        }
    }
    if (empty($fields)) {
        jsonResponse(['success' => false, 'error' => 'No fields to update'], 400);
    }
    $fields[] = 'updated_at = NOW()';
    $values[] = $id;
    $conn->prepare('UPDATE aurelia_orders SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);
    jsonResponse(['success' => true, 'message' => 'Order updated']);
}

function updateOrderStatus(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();
    if (empty($data['id']) || empty($data['status'])) {
        jsonResponse(['success' => false, 'error' => 'id and status required'], 400);
    }

    $id = requireValidId($data['id'], 'order id');
    assertOrderStatus($data['status']);
    if (isset($data['payment_status'])) {
        assertPaymentStatus($data['payment_status']);
    }

    $prev = $conn->prepare('SELECT status FROM aurelia_orders WHERE id = ?');
    $prev->execute([$id]);
    $prevRow = $prev->fetch();
    if (!$prevRow) {
        jsonResponse(['success' => false, 'error' => 'Order not found'], 404);
    }
    $oldStatus = $prevRow['status'];

    $conn->beginTransaction();
    try {
        if (isset($data['payment_status'])) {
            $conn->prepare('UPDATE aurelia_orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?')
                ->execute([$data['status'], $data['payment_status'], $id]);
        } else {
            $conn->prepare('UPDATE aurelia_orders SET status = ?, updated_at = NOW() WHERE id = ?')
                ->execute([$data['status'], $id]);
        }

        $restockStatuses = ['cancelled', 'refunded'];
        if (in_array($data['status'], $restockStatuses, true) && !in_array($oldStatus, $restockStatuses, true)) {
            restoreOrderStock($conn, $id);
        }

        $conn->prepare(
            'INSERT INTO aurelia_order_timeline (id, order_id, status, note, created_by) VALUES (?, ?, ?, ?, ?)'
        )->execute([
            generateId(),
            $id,
            $data['status'],
            isset($data['note']) ? mb_substr(trim($data['note']), 0, 500) : null,
            $admin['id'],
        ]);

        $conn->commit();
        logActivity($conn, $admin['id'], 'status_change', 'order', $id);
        jsonResponse(['success' => true, 'message' => 'Status updated']);
    } catch (Throwable $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        error_log('updateOrderStatus: ' . $e->getMessage());
        jsonResponse(['success' => false, 'error' => 'Failed to update status'], 500);
    }
}

function deleteOrder(PDO $conn): void {
    $admin = requireManager();
    $id = requireValidId($_GET['id'] ?? '', 'order id');

    $stmt = $conn->prepare('SELECT status FROM aurelia_orders WHERE id = ?');
    $stmt->execute([$id]);
    $order = $stmt->fetch();
    if (!$order) {
        jsonResponse(['success' => false, 'error' => 'Order not found'], 404);
    }

    $conn->beginTransaction();
    try {
        if (!in_array($order['status'], ['cancelled', 'refunded'], true)) {
            restoreOrderStock($conn, $id);
        }
        $conn->prepare('DELETE FROM aurelia_orders WHERE id = ?')->execute([$id]);
        $conn->commit();
        logActivity($conn, $admin['id'], 'delete', 'order', $id);
        jsonResponse(['success' => true, 'message' => 'Order deleted']);
    } catch (Throwable $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        jsonResponse(['success' => false, 'error' => 'Failed to delete order'], 500);
    }
}
