<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getCoupon($conn, requireValidId($_GET['id'], 'coupon id'));
        } elseif (isset($_GET['code'])) {
            validateCoupon($conn, $_GET['code']);
        } else {
            getCoupons($conn);
        }
        break;
    case 'POST':
        createCoupon($conn);
        break;
    case 'PUT':
        updateCoupon($conn);
        break;
    case 'DELETE':
        deleteCoupon($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getCoupons(PDO $conn): void {
    authenticateAdmin();
    $stmt = $conn->prepare('SELECT * FROM aurelia_coupons ORDER BY created_at DESC');
    $stmt->execute();
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getCoupon(PDO $conn, string $id): void {
    authenticateAdmin();
    $stmt = $conn->prepare('SELECT * FROM aurelia_coupons WHERE id = ?');
    $stmt->execute([$id]);
    $coupon = $stmt->fetch();
    if (!$coupon) {
        jsonResponse(['success' => false, 'error' => 'Coupon not found'], 404);
    }
    jsonResponse(['success' => true, 'data' => $coupon]);
}

function validateCoupon(PDO $conn, string $code): void {
    $code = strtoupper(trim($code));
    if ($code === '' || strlen($code) > 50) {
        jsonResponse(['success' => false, 'error' => 'Invalid coupon code'], 400);
    }

    $stmt = $conn->prepare('SELECT * FROM aurelia_coupons WHERE code = ? AND is_active = 1');
    $stmt->execute([$code]);
    $coupon = $stmt->fetch();

    if (!$coupon) {
        jsonResponse(['success' => false, 'error' => 'Invalid coupon code'], 404);
    }
    if ($coupon['expires_at'] && strtotime($coupon['expires_at']) < time()) {
        jsonResponse(['success' => false, 'error' => 'Coupon expired'], 400);
    }
    if ($coupon['starts_at'] && strtotime($coupon['starts_at']) > time()) {
        jsonResponse(['success' => false, 'error' => 'Coupon not yet active'], 400);
    }
    if ($coupon['max_uses'] !== null && (int)$coupon['used_count'] >= (int)$coupon['max_uses']) {
        jsonResponse(['success' => false, 'error' => 'Coupon usage limit reached'], 400);
    }

    jsonResponse(['success' => true, 'data' => [
        'code' => $coupon['code'],
        'discount_type' => $coupon['discount_type'],
        'discount_value' => $coupon['discount_value'],
        'min_order_amount' => $coupon['min_order_amount'],
    ]]);
}

function createCoupon(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();

    if (empty($data['code']) || empty($data['discount_type']) || !isset($data['discount_value'])) {
        jsonResponse(['success' => false, 'error' => 'code, discount_type, discount_value required'], 400);
    }

    $type = $data['discount_type'];
    if (!in_array($type, ['percentage', 'fixed', 'percent'], true)) {
        jsonResponse(['success' => false, 'error' => 'Invalid discount_type'], 400);
    }

    $id = generateId();
    try {
        $stmt = $conn->prepare(
            'INSERT INTO aurelia_coupons (id, code, description, discount_type, discount_value, min_order_amount, max_uses, starts_at, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            strtoupper(trim($data['code'])),
            $data['description'] ?? null,
            $type === 'percent' ? 'percentage' : $type,
            (float)$data['discount_value'],
            isset($data['min_order_amount']) ? (float)$data['min_order_amount'] : null,
            isset($data['max_uses']) ? (int)$data['max_uses'] : null,
            $data['starts_at'] ?? null,
            $data['expires_at'] ?? null,
            (int)($data['is_active'] ?? 1),
        ]);
    } catch (PDOException $e) {
        if ((int)$e->errorInfo[1] === 1062) {
            jsonResponse(['success' => false, 'error' => 'Coupon code already exists'], 409);
        }
        throw $e;
    }

    logActivity($conn, $admin['id'], 'create', 'coupon', $id);
    jsonResponse(['success' => true, 'data' => ['id' => $id], 'message' => 'Coupon created'], 201);
}

function updateCoupon(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();
    if (empty($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'ID required'], 400);
    }
    $id = requireValidId($data['id'], 'coupon id');

    $fields = [];
    $values = [];
    $allowed = ['code', 'description', 'discount_type', 'discount_value', 'min_order_amount', 'max_uses', 'starts_at', 'expires_at', 'is_active'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $data)) {
            $val = $f === 'code' ? strtoupper(trim((string)$data[$f])) : $data[$f];
            if ($f === 'discount_type' && $val === 'percent') {
                $val = 'percentage';
            }
            $fields[] = "$f = ?";
            $values[] = $val;
        }
    }
    if (empty($fields)) {
        jsonResponse(['success' => false, 'error' => 'No fields'], 400);
    }
    $fields[] = 'updated_at = NOW()';
    $values[] = $id;
    $conn->prepare('UPDATE aurelia_coupons SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);

    logActivity($conn, $admin['id'], 'update', 'coupon', $id);
    jsonResponse(['success' => true, 'message' => 'Coupon updated']);
}

function deleteCoupon(PDO $conn): void {
    $admin = requireManager();
    $id = requireValidId($_GET['id'] ?? '', 'coupon id');
    $stmt = $conn->prepare('DELETE FROM aurelia_coupons WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'error' => 'Coupon not found'], 404);
    }
    logActivity($conn, $admin['id'], 'delete', 'coupon', $id);
    jsonResponse(['success' => true, 'message' => 'Coupon deleted']);
}
