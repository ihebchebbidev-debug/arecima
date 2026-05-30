<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        if (!empty($_GET['product_id'])) {
            getProductReviews($conn, requireValidId($_GET['product_id'], 'product_id'));
        } elseif (!empty($_GET['featured'])) {
            getFeaturedReviews($conn);
        } else {
            getAllReviews($conn);
        }
        break;
    case 'POST':
        createReview($conn);
        break;
    case 'PUT':
        updateReview($conn);
        break;
    case 'DELETE':
        deleteReview($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getAllReviews(PDO $conn): void {
    authenticateAdmin();
    $where = 'WHERE 1=1';
    $params = [];
    if (isset($_GET['is_approved'])) {
        $where .= ' AND r.is_approved = ?';
        $params[] = (int)$_GET['is_approved'];
    }

    $query = "SELECT r.*, p.name_fr AS product_name FROM aurelia_reviews r
              LEFT JOIN aurelia_products p ON r.product_id = p.id
              $where ORDER BY r.created_at DESC";
    $countQuery = "SELECT COUNT(*) FROM aurelia_reviews r $where";

    $result = paginate($query, $countQuery, $params, $conn);
    jsonResponse(['success' => true, 'data' => $result['items'], 'pagination' => $result['pagination']]);
}

function getFeaturedReviews(PDO $conn): void {
    $limit = min(10, max(1, (int)($_GET['limit'] ?? 3)));
    $stmt = $conn->prepare(
        'SELECT r.id, r.product_id, r.customer_name, r.rating, r.title, r.body, r.is_verified, r.created_at,
                p.name_fr AS product_name, p.slug AS product_slug
         FROM aurelia_reviews r
         LEFT JOIN aurelia_products p ON r.product_id = p.id
         WHERE r.is_approved = 1
         ORDER BY r.created_at DESC
         LIMIT ' . $limit
    );
    $stmt->execute();
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getProductReviews(PDO $conn, string $productId): void {
    $stmt = $conn->prepare(
        'SELECT id, product_id, customer_name, rating, title, body, is_verified, created_at
         FROM aurelia_reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC'
    );
    $stmt->execute([$productId]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function createReview(PDO $conn): void {
    $data = getRequestBody();

    if (empty($data['product_id']) || empty($data['customer_name']) || !isset($data['rating'])) {
        jsonResponse(['success' => false, 'error' => 'product_id, customer_name, rating required'], 400);
    }

    $productId = requireValidId($data['product_id'], 'product_id');
    $rating = (int)$data['rating'];
    if ($rating < 1 || $rating > 5) {
        jsonResponse(['success' => false, 'error' => 'Rating must be 1–5'], 400);
    }

    $check = $conn->prepare('SELECT id FROM aurelia_products WHERE id = ? AND is_active = 1');
    $check->execute([$productId]);
    if (!$check->fetch()) {
        jsonResponse(['success' => false, 'error' => 'Product not found'], 404);
    }

    $id = generateId();
    $conn->prepare(
        'INSERT INTO aurelia_reviews (id, product_id, customer_id, customer_name, rating, title, body, is_verified, is_approved)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)'
    )->execute([
        $id,
        $productId,
        !empty($data['customer_id']) ? requireValidId($data['customer_id'], 'customer_id') : null,
        mb_substr(trim($data['customer_name']), 0, 255),
        $rating,
        isset($data['title']) ? mb_substr(trim($data['title']), 0, 255) : null,
        isset($data['body']) ? mb_substr(trim($data['body']), 0, 5000) : null,
        (int)($data['is_verified'] ?? 0),
    ]);

    jsonResponse(['success' => true, 'data' => ['id' => $id], 'message' => 'Review submitted'], 201);
}

function recalcProductRating(PDO $conn, string $productId): void {
    $stats = $conn->prepare(
        'SELECT COALESCE(AVG(rating), 0) AS avg_rating, COUNT(*) AS cnt
         FROM aurelia_reviews WHERE product_id = ? AND is_approved = 1'
    );
    $stats->execute([$productId]);
    $s = $stats->fetch();
    $conn->prepare('UPDATE aurelia_products SET rating = ?, review_count = ? WHERE id = ?')
        ->execute([round((float)$s['avg_rating'], 1), (int)$s['cnt'], $productId]);
}

function updateReview(PDO $conn): void {
    authenticateAdmin();
    $data = getRequestBody();
    if (empty($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'ID required'], 400);
    }
    $id = requireValidId($data['id'], 'review id');

    if (isset($data['is_approved'])) {
        $conn->prepare('UPDATE aurelia_reviews SET is_approved = ? WHERE id = ?')
            ->execute([(int)$data['is_approved'], $id]);

        $review = $conn->prepare('SELECT product_id FROM aurelia_reviews WHERE id = ?');
        $review->execute([$id]);
        $r = $review->fetch();
        if ($r) {
            recalcProductRating($conn, $r['product_id']);
        }
    }

    jsonResponse(['success' => true, 'message' => 'Review updated']);
}

function deleteReview(PDO $conn): void {
    authenticateAdmin();
    $id = requireValidId($_GET['id'] ?? '', 'review id');

    $review = $conn->prepare('SELECT product_id FROM aurelia_reviews WHERE id = ?');
    $review->execute([$id]);
    $r = $review->fetch();

    $conn->prepare('DELETE FROM aurelia_reviews WHERE id = ?')->execute([$id]);

    if ($r) {
        recalcProductRating($conn, $r['product_id']);
    }

    jsonResponse(['success' => true, 'message' => 'Review deleted']);
}
