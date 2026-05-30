<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        authenticateAdmin();
        if (isset($_GET['id'])) {
            getCustomer($conn, requireValidId($_GET['id'], 'customer id'));
        } else {
            getCustomers($conn);
        }
        break;
    case 'POST':
        createCustomer($conn);
        break;
    case 'PUT':
        updateCustomer($conn);
        break;
    case 'DELETE':
        deleteCustomer($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getCustomers(PDO $conn): void {
    $where = 'WHERE 1=1';
    $params = [];

    if (!empty($_GET['search'])) {
        $where .= ' AND (c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)';
        $s = '%' . mb_substr(trim($_GET['search']), 0, 100) . '%';
        $params = array_merge($params, [$s, $s, $s, $s]);
    }
    if (!empty($_GET['country'])) {
        $where .= ' AND c.country = ?';
        $params[] = mb_substr(trim($_GET['country']), 0, 100);
    }
    if (isset($_GET['is_subscribed'])) {
        $where .= ' AND c.is_subscribed = ?';
        $params[] = (int)$_GET['is_subscribed'];
    }

    $sort = $_GET['sort'] ?? 'created_at';
    $order = (isset($_GET['order']) && strtoupper($_GET['order']) === 'ASC') ? 'ASC' : 'DESC';
    $allowedSorts = ['created_at', 'total_spent', 'total_orders', 'last_name', 'last_order_at'];
    if (!in_array($sort, $allowedSorts, true)) {
        $sort = 'created_at';
    }

    $query = "SELECT c.* FROM aurelia_customers c $where ORDER BY c.$sort $order";
    $countQuery = "SELECT COUNT(*) FROM aurelia_customers c $where";

    $result = paginate($query, $countQuery, $params, $conn);
    jsonResponse(['success' => true, 'data' => $result['items'], 'pagination' => $result['pagination']]);
}

function getCustomer(PDO $conn, string $id): void {
    $stmt = $conn->prepare('SELECT * FROM aurelia_customers WHERE id = ?');
    $stmt->execute([$id]);
    $customer = $stmt->fetch();
    if (!$customer) {
        jsonResponse(['success' => false, 'error' => 'Customer not found'], 404);
    }

    $tagStmt = $conn->prepare('SELECT tag FROM aurelia_customer_tags WHERE customer_id = ?');
    $tagStmt->execute([$id]);
    $customer['tags'] = array_column($tagStmt->fetchAll(), 'tag');

    $orderStmt = $conn->prepare(
        'SELECT id, order_number, status, total, created_at FROM aurelia_orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 10'
    );
    $orderStmt->execute([$id]);
    $customer['recent_orders'] = $orderStmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $customer]);
}

function createCustomer(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();

    if (empty($data['email']) || empty($data['first_name']) || empty($data['last_name'])) {
        jsonResponse(['success' => false, 'error' => 'email, first_name, last_name required'], 400);
    }

    if (!validateEmail($data['email'])) {
        jsonResponse(['success' => false, 'error' => 'Invalid email'], 400);
    }

    $id = generateId();
    try {
        $stmt = $conn->prepare(
            'INSERT INTO aurelia_customers (id, email, first_name, last_name, phone, country, city, address, postal_code, is_subscribed, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            trim($data['email']),
            trim($data['first_name']),
            trim($data['last_name']),
            $data['phone'] ?? null,
            $data['country'] ?? null,
            $data['city'] ?? null,
            $data['address'] ?? null,
            $data['postal_code'] ?? null,
            (int)($data['is_subscribed'] ?? 0),
            $data['notes'] ?? null,
        ]);
    } catch (PDOException $e) {
        if ((int)$e->errorInfo[1] === 1062) {
            jsonResponse(['success' => false, 'error' => 'Email already exists'], 409);
        }
        throw $e;
    }

    if (!empty($data['tags']) && is_array($data['tags'])) {
        $tagStmt = $conn->prepare('INSERT INTO aurelia_customer_tags (id, customer_id, tag) VALUES (?, ?, ?)');
        foreach ($data['tags'] as $tag) {
            $tag = trim((string)$tag);
            if ($tag !== '') {
                $tagStmt->execute([generateId(), $id, mb_substr($tag, 0, 100)]);
            }
        }
    }

    logActivity($conn, $admin['id'], 'create', 'customer', $id);
    jsonResponse(['success' => true, 'data' => ['id' => $id], 'message' => 'Customer created'], 201);
}

function updateCustomer(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();
    if (empty($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'ID required'], 400);
    }
    $id = requireValidId($data['id'], 'customer id');

    if (isset($data['email']) && !validateEmail($data['email'])) {
        jsonResponse(['success' => false, 'error' => 'Invalid email'], 400);
    }

    $fields = [];
    $values = [];
    $allowed = ['email', 'first_name', 'last_name', 'phone', 'country', 'city', 'address', 'postal_code', 'is_subscribed', 'notes'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $data)) {
            $fields[] = "$f = ?";
            $values[] = $data[$f];
        }
    }
    if (empty($fields)) {
        jsonResponse(['success' => false, 'error' => 'No fields'], 400);
    }
    $fields[] = 'updated_at = NOW()';
    $values[] = $id;

    try {
        $stmt = $conn->prepare('UPDATE aurelia_customers SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($values);
    } catch (PDOException $e) {
        if ((int)$e->errorInfo[1] === 1062) {
            jsonResponse(['success' => false, 'error' => 'Email already in use'], 409);
        }
        throw $e;
    }

    if (isset($data['tags']) && is_array($data['tags'])) {
        $conn->prepare('DELETE FROM aurelia_customer_tags WHERE customer_id = ?')->execute([$id]);
        $tagStmt = $conn->prepare('INSERT INTO aurelia_customer_tags (id, customer_id, tag) VALUES (?, ?, ?)');
        foreach ($data['tags'] as $tag) {
            $tag = trim((string)$tag);
            if ($tag !== '') {
                $tagStmt->execute([generateId(), $id, mb_substr($tag, 0, 100)]);
            }
        }
    }

    logActivity($conn, $admin['id'], 'update', 'customer', $id);
    jsonResponse(['success' => true, 'message' => 'Customer updated']);
}

function deleteCustomer(PDO $conn): void {
    $admin = requireManager();
    $id = requireValidId($_GET['id'] ?? '', 'customer id');

    $stmt = $conn->prepare('DELETE FROM aurelia_customers WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'error' => 'Customer not found'], 404);
    }

    logActivity($conn, $admin['id'], 'delete', 'customer', $id);
    jsonResponse(['success' => true, 'message' => 'Customer deleted']);
}
