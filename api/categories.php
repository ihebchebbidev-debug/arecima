<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getCategory($conn, requireValidId($_GET['id'], 'category id'));
        } else {
            getCategories($conn);
        }
        break;
    case 'POST':
        createCategory($conn);
        break;
    case 'PUT':
        updateCategory($conn);
        break;
    case 'DELETE':
        deleteCategory($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getCategories(PDO $conn): void {
    $admin = tryAuthenticateAdmin();
    $where = $admin ? '' : ' WHERE c.is_active = 1';

    $stmt = $conn->prepare(
        "SELECT c.*,
            (SELECT COUNT(*) FROM aurelia_products p WHERE p.category_id = c.id AND p.is_active = 1) AS product_count
         FROM aurelia_categories c
         $where
         ORDER BY c.sort_order ASC, c.name_fr ASC"
    );
    $stmt->execute();
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getCategory(PDO $conn, string $id): void {
    $stmt = $conn->prepare('SELECT * FROM aurelia_categories WHERE id = ?');
    $stmt->execute([$id]);
    $cat = $stmt->fetch();
    if (!$cat) {
        jsonResponse(['success' => false, 'error' => 'Category not found'], 404);
    }
    if (!(int)$cat['is_active'] && !tryAuthenticateAdmin()) {
        jsonResponse(['success' => false, 'error' => 'Category not found'], 404);
    }
    jsonResponse(['success' => true, 'data' => $cat]);
}

function createCategory(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();

    if (empty($data['name_fr']) || empty($data['slug'])) {
        jsonResponse(['success' => false, 'error' => 'name_fr and slug are required'], 400);
    }

    $slug = sanitizeSlug($data['slug']);
    if ($slug === '') {
        jsonResponse(['success' => false, 'error' => 'Invalid slug'], 400);
    }

    $id = generateId();
    try {
        $stmt = $conn->prepare(
            'INSERT INTO aurelia_categories (id, slug, name_fr, name_en, name_ar, description_fr, description_en, description_ar, image_url, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $slug,
            trim($data['name_fr']),
            $data['name_en'] ?? null,
            $data['name_ar'] ?? null,
            $data['description_fr'] ?? null,
            $data['description_en'] ?? null,
            $data['description_ar'] ?? null,
            $data['image_url'] ?? null,
            (int)($data['sort_order'] ?? 0),
            (int)($data['is_active'] ?? 1),
        ]);
    } catch (PDOException $e) {
        if ((int)$e->errorInfo[1] === 1062) {
            jsonResponse(['success' => false, 'error' => 'Slug already exists'], 409);
        }
        throw $e;
    }

    logActivity($conn, $admin['id'], 'create', 'category', $id);
    jsonResponse(['success' => true, 'data' => ['id' => $id], 'message' => 'Category created'], 201);
}

function updateCategory(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();
    if (empty($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'ID required'], 400);
    }
    $id = requireValidId($data['id'], 'category id');

    $fields = [];
    $values = [];
    $allowed = ['slug', 'name_fr', 'name_en', 'name_ar', 'description_fr', 'description_en', 'description_ar', 'image_url', 'sort_order', 'is_active'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $data)) {
            $val = $f === 'slug' ? sanitizeSlug((string)$data[$f]) : $data[$f];
            $fields[] = "$f = ?";
            $values[] = $val;
        }
    }
    if (empty($fields)) {
        jsonResponse(['success' => false, 'error' => 'No fields to update'], 400);
    }
    $fields[] = 'updated_at = NOW()';
    $values[] = $id;

    try {
        $conn->prepare('UPDATE aurelia_categories SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);
    } catch (PDOException $e) {
        if ((int)$e->errorInfo[1] === 1062) {
            jsonResponse(['success' => false, 'error' => 'Slug already exists'], 409);
        }
        throw $e;
    }

    logActivity($conn, $admin['id'], 'update', 'category', $id);
    jsonResponse(['success' => true, 'message' => 'Category updated']);
}

function deleteCategory(PDO $conn): void {
    $admin = requireManager();
    $id = requireValidId($_GET['id'] ?? '', 'category id');

    $count = $conn->prepare('SELECT COUNT(*) FROM aurelia_products WHERE category_id = ?');
    $count->execute([$id]);
    if ((int)$count->fetchColumn() > 0) {
        jsonResponse(['success' => false, 'error' => 'Category has products — reassign or delete them first'], 409);
    }

    $stmt = $conn->prepare('DELETE FROM aurelia_categories WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'error' => 'Category not found'], 404);
    }

    logActivity($conn, $admin['id'], 'delete', 'category', $id);
    jsonResponse(['success' => true, 'message' => 'Category deleted']);
}
