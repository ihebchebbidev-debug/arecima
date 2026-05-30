<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getPost($conn, requireValidId($_GET['id'], 'post id'));
        } elseif (isset($_GET['slug'])) {
            getPostBySlug($conn, $_GET['slug']);
        } else {
            getPosts($conn);
        }
        break;
    case 'POST':
        createPost($conn);
        break;
    case 'PUT':
        updatePost($conn);
        break;
    case 'DELETE':
        deletePost($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function getPosts(PDO $conn): void {
    $admin = tryAuthenticateAdmin();
    $where = 'WHERE 1=1';
    $params = [];

    if (!$admin && empty($_GET['all'])) {
        $where .= ' AND b.is_published = 1';
    } elseif (isset($_GET['is_published'])) {
        $where .= ' AND b.is_published = ?';
        $params[] = (int)$_GET['is_published'];
    }
    if (!empty($_GET['search'])) {
        $where .= ' AND (b.title_fr LIKE ? OR b.title_en LIKE ?)';
        $s = '%' . mb_substr(trim($_GET['search']), 0, 100) . '%';
        $params[] = $s;
        $params[] = $s;
    }

    $query = "SELECT b.*, a.full_name AS author_name FROM aurelia_blog_posts b
              LEFT JOIN aurelia_admin_users a ON b.author_id = a.id
              $where ORDER BY b.created_at DESC";
    $countQuery = "SELECT COUNT(*) FROM aurelia_blog_posts b $where";

    $result = paginate($query, $countQuery, $params, $conn);
    jsonResponse(['success' => true, 'data' => $result['items'], 'pagination' => $result['pagination']]);
}

function getPost(PDO $conn, string $id): void {
    $stmt = $conn->prepare(
        "SELECT b.*, a.full_name AS author_name FROM aurelia_blog_posts b
         LEFT JOIN aurelia_admin_users a ON b.author_id = a.id
         WHERE b.id = ?"
    );
    $stmt->execute([$id]);
    $post = $stmt->fetch();
    if (!$post) {
        jsonResponse(['success' => false, 'error' => 'Post not found'], 404);
    }
    if (!(int)$post['is_published'] && !tryAuthenticateAdmin()) {
        jsonResponse(['success' => false, 'error' => 'Post not found'], 404);
    }

    $tagStmt = $conn->prepare('SELECT tag FROM aurelia_blog_tags WHERE post_id = ?');
    $tagStmt->execute([$id]);
    $post['tags'] = array_column($tagStmt->fetchAll(), 'tag');

    jsonResponse(['success' => true, 'data' => $post]);
}

function getPostBySlug(PDO $conn, string $slug): void {
    $slug = sanitizeSlug($slug);
    $stmt = $conn->prepare('SELECT id FROM aurelia_blog_posts WHERE slug = ?');
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if (!$row) {
        jsonResponse(['success' => false, 'error' => 'Post not found'], 404);
    }
    getPost($conn, $row['id']);
}

function createPost(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();

    if (empty($data['title_fr']) || empty($data['slug'])) {
        jsonResponse(['success' => false, 'error' => 'title_fr and slug required'], 400);
    }

    $slug = sanitizeSlug($data['slug']);
    $id = generateId();
    $stmt = $conn->prepare(
        "INSERT INTO aurelia_blog_posts (id, slug, author_id, title_fr, title_en, title_ar, content_fr, content_en, content_ar, excerpt_fr, excerpt_en, excerpt_ar, category_fr, category_en, category_ar, image_url, read_time, is_published, seo_title, seo_description, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $id,
        $slug,
        $admin['id'],
        trim($data['title_fr']),
        $data['title_en'] ?? null,
        $data['title_ar'] ?? null,
        $data['content_fr'] ?? null,
        $data['content_en'] ?? null,
        $data['content_ar'] ?? null,
        $data['excerpt_fr'] ?? null,
        $data['excerpt_en'] ?? null,
        $data['excerpt_ar'] ?? null,
        $data['category_fr'] ?? null,
        $data['category_en'] ?? null,
        $data['category_ar'] ?? null,
        $data['image_url'] ?? null,
        max(1, (int)($data['read_time'] ?? 5)),
        (int)($data['is_published'] ?? 0),
        $data['seo_title'] ?? null,
        $data['seo_description'] ?? null,
        !empty($data['is_published']) ? date('Y-m-d H:i:s') : null,
    ]);

    if (!empty($data['tags']) && is_array($data['tags'])) {
        $tagStmt = $conn->prepare('INSERT INTO aurelia_blog_tags (id, post_id, tag) VALUES (?, ?, ?)');
        foreach ($data['tags'] as $tag) {
            $tag = trim((string)$tag);
            if ($tag !== '') {
                $tagStmt->execute([generateId(), $id, mb_substr($tag, 0, 100)]);
            }
        }
    }

    logActivity($conn, $admin['id'], 'create', 'blog_post', $id);
    jsonResponse(['success' => true, 'data' => ['id' => $id], 'message' => 'Post created'], 201);
}

function updatePost(PDO $conn): void {
    $admin = requireManager();
    $data = getRequestBody();
    if (empty($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'ID required'], 400);
    }
    $id = requireValidId($data['id'], 'post id');

    $fields = [];
    $values = [];
    $allowed = ['slug', 'title_fr', 'title_en', 'title_ar', 'content_fr', 'content_en', 'content_ar', 'excerpt_fr', 'excerpt_en', 'excerpt_ar', 'category_fr', 'category_en', 'category_ar', 'image_url', 'read_time', 'is_published', 'seo_title', 'seo_description'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $data)) {
            $val = $f === 'slug' ? sanitizeSlug((string)$data[$f]) : $data[$f];
            $fields[] = "$f = ?";
            $values[] = $val;
        }
    }

    if (isset($data['is_published']) && $data['is_published']) {
        $fields[] = 'published_at = COALESCE(published_at, NOW())';
    }

    if (empty($fields)) {
        jsonResponse(['success' => false, 'error' => 'No fields'], 400);
    }
    $fields[] = 'updated_at = NOW()';
    $values[] = $id;
    $conn->prepare('UPDATE aurelia_blog_posts SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);

    if (isset($data['tags']) && is_array($data['tags'])) {
        $conn->prepare('DELETE FROM aurelia_blog_tags WHERE post_id = ?')->execute([$id]);
        $tagStmt = $conn->prepare('INSERT INTO aurelia_blog_tags (id, post_id, tag) VALUES (?, ?, ?)');
        foreach ($data['tags'] as $tag) {
            $tag = trim((string)$tag);
            if ($tag !== '') {
                $tagStmt->execute([generateId(), $id, mb_substr($tag, 0, 100)]);
            }
        }
    }

    logActivity($conn, $admin['id'], 'update', 'blog_post', $id);
    jsonResponse(['success' => true, 'message' => 'Post updated']);
}

function deletePost(PDO $conn): void {
    $admin = requireManager();
    $id = requireValidId($_GET['id'] ?? '', 'post id');
    $stmt = $conn->prepare('DELETE FROM aurelia_blog_posts WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'error' => 'Post not found'], 404);
    }
    logActivity($conn, $admin['id'], 'delete', 'blog_post', $id);
    jsonResponse(['success' => true, 'message' => 'Post deleted']);
}
