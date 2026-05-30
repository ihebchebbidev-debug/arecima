<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        authenticateAdmin();
        getSubscribers($conn);
        break;
    case 'POST':
        subscribe($conn);
        break;
    case 'DELETE':
        if (!empty($_GET['email'])) {
            unsubscribe($conn, $_GET['email']);
        } else {
            authenticateAdmin();
            deleteSubscriber($conn);
        }
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getSubscribers(PDO $conn): void {
    $query = 'SELECT * FROM aurelia_newsletter_subscribers ORDER BY subscribed_at DESC';
    $countQuery = 'SELECT COUNT(*) FROM aurelia_newsletter_subscribers';
    $result = paginate($query, $countQuery, [], $conn);
    jsonResponse(['success' => true, 'data' => $result['items'], 'pagination' => $result['pagination']]);
}

function subscribe(PDO $conn): void {
    $data = getRequestBody();
    $email = trim($data['email'] ?? '');

    if ($email === '' || !validateEmail($email)) {
        jsonResponse(['success' => false, 'error' => 'Valid email required'], 400);
    }

    $stmt = $conn->prepare('SELECT id, is_active FROM aurelia_newsletter_subscribers WHERE email = ?');
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        if (!(int)$existing['is_active']) {
            $conn->prepare(
                'UPDATE aurelia_newsletter_subscribers SET is_active = 1, unsubscribed_at = NULL WHERE id = ?'
            )->execute([$existing['id']]);
            jsonResponse(['success' => true, 'message' => 'Re-subscribed successfully']);
        }
        jsonResponse(['success' => true, 'message' => 'Already subscribed']);
    }

    $id = generateId();
    $conn->prepare(
        'INSERT INTO aurelia_newsletter_subscribers (id, email, first_name, source) VALUES (?, ?, ?, ?)'
    )->execute([
        $id,
        $email,
        isset($data['first_name']) ? mb_substr(trim($data['first_name']), 0, 100) : null,
        mb_substr((string)($data['source'] ?? 'website'), 0, 50),
    ]);

    jsonResponse(['success' => true, 'message' => 'Subscribed successfully'], 201);
}

function unsubscribe(PDO $conn, string $email): void {
    $email = trim($email);
    if ($email === '' || !validateEmail($email)) {
        jsonResponse(['success' => false, 'error' => 'Valid email required'], 400);
    }
    $conn->prepare(
        'UPDATE aurelia_newsletter_subscribers SET is_active = 0, unsubscribed_at = NOW() WHERE email = ?'
    )->execute([$email]);
    jsonResponse(['success' => true, 'message' => 'Unsubscribed']);
}

function deleteSubscriber(PDO $conn): void {
    $id = requireValidId($_GET['id'] ?? '', 'subscriber id');
    $stmt = $conn->prepare('DELETE FROM aurelia_newsletter_subscribers WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'error' => 'Subscriber not found'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Subscriber deleted']);
}
