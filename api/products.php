<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getProduct($conn, requireValidId($_GET['id'], 'product id'));
        } elseif (isset($_GET['slug'])) {
            getProductBySlug($conn, $_GET['slug']);
        } else {
            getProducts($conn);
        }
        break;
    case 'POST':
        createProduct($conn);
        break;
    case 'PUT':
        updateProduct($conn);
        break;
    case 'DELETE':
        deleteProduct($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getProducts(PDO $conn): void {
    $admin = tryAuthenticateAdmin();
    $where = 'WHERE 1=1';
    $params = [];

    if (!$admin && !isset($_GET['all'])) {
        $where .= ' AND p.is_active = 1';
    }
    if (isset($_GET['category_id']) && $_GET['category_id'] !== '') {
        $where .= ' AND p.category_id = ?';
        $params[] = requireValidId($_GET['category_id'], 'category_id');
    }
    if (isset($_GET['is_active']) && $admin) {
        $where .= ' AND p.is_active = ?';
        $params[] = (int)$_GET['is_active'];
    }
    if (!empty($_GET['is_new'])) {
        $where .= ' AND p.is_new = 1';
    }
    if (!empty($_GET['is_best_seller'])) {
        $where .= ' AND p.is_best_seller = 1';
    }
    if (!empty($_GET['search'])) {
        $where .= ' AND (p.name_fr LIKE ? OR p.name_en LIKE ? OR p.sku LIKE ?)';
        $search = '%' . mb_substr(trim($_GET['search']), 0, 100) . '%';
        $params[] = $search;
        $params[] = $search;
        $params[] = $search;
    }
    if (isset($_GET['min_price'])) {
        $where .= ' AND p.price >= ?';
        $params[] = (float)$_GET['min_price'];
    }
    if (isset($_GET['max_price'])) {
        $where .= ' AND p.price <= ?';
        $params[] = (float)$_GET['max_price'];
    }

    $sort = $_GET['sort'] ?? 'created_at';
    $order = (isset($_GET['order']) && strtoupper($_GET['order']) === 'ASC') ? 'ASC' : 'DESC';
    $allowedSorts = ['created_at', 'price', 'name_fr', 'stock', 'rating'];
    if (!in_array($sort, $allowedSorts, true)) {
        $sort = 'created_at';
    }

    $query = "SELECT p.*, c.name_fr AS category_name, c.slug AS category_slug,
              (SELECT url FROM aurelia_product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image
              FROM aurelia_products p
              LEFT JOIN aurelia_categories c ON p.category_id = c.id
              $where ORDER BY p.$sort $order";

    $countQuery = "SELECT COUNT(*) FROM aurelia_products p $where";

    $result = paginate($query, $countQuery, $params, $conn);
    jsonResponse(['success' => true, 'data' => $result['items'], 'pagination' => $result['pagination']]);
}

function getProduct(PDO $conn, string $id): void {
    $stmt = $conn->prepare(
        "SELECT p.*, c.name_fr AS category_name, c.slug AS category_slug
         FROM aurelia_products p
         LEFT JOIN aurelia_categories c ON p.category_id = c.id
         WHERE p.id = ?"
    );
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if (!$product) {
        jsonResponse(['success' => false, 'error' => 'Product not found'], 404);
    }

    if (!(int)$product['is_active'] && !tryAuthenticateAdmin()) {
        jsonResponse(['success' => false, 'error' => 'Product not found'], 404);
    }

    $imgStmt = $conn->prepare('SELECT * FROM aurelia_product_images WHERE product_id = ? ORDER BY sort_order');
    $imgStmt->execute([$id]);
    $product['images'] = $imgStmt->fetchAll();

    $tagStmt = $conn->prepare('SELECT tag FROM aurelia_product_tags WHERE product_id = ?');
    $tagStmt->execute([$id]);
    $product['tags'] = array_column($tagStmt->fetchAll(), 'tag');

    jsonResponse(['success' => true, 'data' => $product]);
}

function getProductBySlug(PDO $conn, string $slug): void {
    $slug = sanitizeSlug($slug);
    if ($slug === '') {
        jsonResponse(['success' => false, 'error' => 'Invalid slug'], 400);
    }
    $stmt = $conn->prepare('SELECT id FROM aurelia_products WHERE slug = ?');
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if (!$row) {
        jsonResponse(['success' => false, 'error' => 'Product not found'], 404);
    }
    getProduct($conn, $row['id']);
}

function createProduct(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();

    foreach (['name_fr', 'slug', 'price'] as $field) {
        if (!isset($data[$field]) || $data[$field] === '') {
            jsonResponse(['success' => false, 'error' => "Field '$field' is required"], 400);
        }
    }

    $slug = sanitizeSlug($data['slug']);
    if ($slug === '') {
        jsonResponse(['success' => false, 'error' => 'Invalid slug'], 400);
    }

    $price = (float)$data['price'];
    if ($price < 0) {
        jsonResponse(['success' => false, 'error' => 'Price must be non-negative'], 400);
    }

    $id = generateId();
    $stmt = $conn->prepare(
        "INSERT INTO aurelia_products
        (id, slug, sku, barcode, category_id, name_fr, name_en, name_ar,
         description_fr, description_en, description_ar, ingredients_fr, ingredients_en, ingredients_ar,
         price, original_price, cost_price, stock, low_stock_threshold, weight_grams, size,
         is_active, is_new, is_best_seller, seo_title, seo_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->execute([
        $id,
        $slug,
        $data['sku'] ?? null,
        $data['barcode'] ?? null,
        !empty($data['category_id']) ? requireValidId($data['category_id'], 'category_id') : null,
        trim($data['name_fr']),
        $data['name_en'] ?? null,
        $data['name_ar'] ?? null,
        $data['description_fr'] ?? null,
        $data['description_en'] ?? null,
        $data['description_ar'] ?? null,
        $data['ingredients_fr'] ?? null,
        $data['ingredients_en'] ?? null,
        $data['ingredients_ar'] ?? null,
        $price,
        isset($data['original_price']) ? (float)$data['original_price'] : null,
        (float)($data['cost_price'] ?? 0),
        max(0, (int)($data['stock'] ?? 0)),
        max(0, (int)($data['low_stock_threshold'] ?? 10)),
        isset($data['weight_grams']) ? (int)$data['weight_grams'] : null,
        $data['size'] ?? null,
        (int)($data['is_active'] ?? 1),
        (int)($data['is_new'] ?? 0),
        (int)($data['is_best_seller'] ?? 0),
        $data['seo_title'] ?? null,
        $data['seo_description'] ?? null,
    ]);

    if (!empty($data['tags']) && is_array($data['tags'])) {
        $tagStmt = $conn->prepare('INSERT INTO aurelia_product_tags (id, product_id, tag) VALUES (?, ?, ?)');
        foreach ($data['tags'] as $tag) {
            $tag = trim((string)$tag);
            if ($tag !== '') {
                $tagStmt->execute([generateId(), $id, mb_substr($tag, 0, 100)]);
            }
        }
    }

    logActivity($conn, $admin['id'], 'create', 'product', $id);
    jsonResponse(['success' => true, 'data' => ['id' => $id], 'message' => 'Product created'], 201);
}

function updateProduct(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();

    if (empty($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'Product ID required'], 400);
    }
    $id = requireValidId($data['id'], 'product id');

    $fields = [];
    $values = [];
    $allowed = [
        'slug', 'sku', 'barcode', 'category_id', 'name_fr', 'name_en', 'name_ar',
        'description_fr', 'description_en', 'description_ar', 'ingredients_fr', 'ingredients_en', 'ingredients_ar',
        'price', 'original_price', 'cost_price', 'stock', 'low_stock_threshold', 'weight_grams', 'size',
        'is_active', 'is_new', 'is_best_seller', 'seo_title', 'seo_description', 'rating', 'review_count',
    ];

    foreach ($allowed as $field) {
        if (!array_key_exists($field, $data)) {
            continue;
        }
        $val = $data[$field];
        if ($field === 'slug') {
            $val = sanitizeSlug((string)$val);
        }
        if ($field === 'category_id' && $val !== null && $val !== '') {
            $val = requireValidId($val, 'category_id');
        }
        $fields[] = "$field = ?";
        $values[] = $val;
    }

    if (empty($fields)) {
        jsonResponse(['success' => false, 'error' => 'No fields to update'], 400);
    }

    $fields[] = 'updated_at = NOW()';
    $values[] = $id;

    $stmt = $conn->prepare('UPDATE aurelia_products SET ' . implode(', ', $fields) . ' WHERE id = ?');
    $stmt->execute($values);

    if (!$stmt->rowCount() && empty($data['tags'])) {
        $check = $conn->prepare('SELECT id FROM aurelia_products WHERE id = ?');
        $check->execute([$id]);
        if (!$check->fetch()) {
            jsonResponse(['success' => false, 'error' => 'Product not found'], 404);
        }
    }

    if (isset($data['tags']) && is_array($data['tags'])) {
        $conn->prepare('DELETE FROM aurelia_product_tags WHERE product_id = ?')->execute([$id]);
        $tagStmt = $conn->prepare('INSERT INTO aurelia_product_tags (id, product_id, tag) VALUES (?, ?, ?)');
        foreach ($data['tags'] as $tag) {
            $tag = trim((string)$tag);
            if ($tag !== '') {
                $tagStmt->execute([generateId(), $id, mb_substr($tag, 0, 100)]);
            }
        }
    }

    logActivity($conn, $admin['id'], 'update', 'product', $id);
    jsonResponse(['success' => true, 'message' => 'Product updated']);
}

function deleteProduct(PDO $conn): void {
    $admin = requireManager();
    $id = requireValidId($_GET['id'] ?? '', 'product id');

    $stmt = $conn->prepare('DELETE FROM aurelia_products WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'error' => 'Product not found'], 404);
    }

    logActivity($conn, $admin['id'], 'delete', 'product', $id);
    jsonResponse(['success' => true, 'message' => 'Product deleted']);
}
