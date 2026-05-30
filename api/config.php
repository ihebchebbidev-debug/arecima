<?php
/**
 * Arecima API — production config (luccibyey.com.tn)
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

define('DB_HOST', 'luccybcdb.mysql.db');
define('DB_USER', 'luccybcdb');
define('DB_PASS', 'Dadouhibou2025');
define('DB_NAME', 'luccybcdb');
define('APP_DEBUG', false);

// Main admin — login: Admin / password: Admin@2026
define('HARDCODED_ADMIN_ID', 'b2222222222222222222222222222222');
define('HARDCODED_ADMIN_LOGIN', 'Admin');
define('HARDCODED_ADMIN_PASSWORD', 'Admin@2026');
define('HARDCODED_ADMIN_PASSWORD_HASH', '$2y$10$5IUcsLsUYcZ4hpJTm9nTZemtW5iGwB8cxpmMkJyNIFr/Avt0dtKf.');

// CORS — allow all origins
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Auth-Token');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
class Database {
    private static $instance = null;

    public $conn;

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        try {
            $this->conn = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            error_log('DB connection failed: ' . $e->getMessage());
            jsonResponse([
                'success' => false,
                'error' => APP_DEBUG ? $e->getMessage() : 'Database connection failed',
            ], 500);
        }
    }
}

function getDB(): PDO {
    return Database::getInstance()->conn;
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function getRequestBody(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function getBearerToken(): ?string {
    $headers = [];
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if ($headers) {
            foreach ($headers as $k => $v) {
                $headers[strtolower($k)] = $v;
            }
        }
    }
    $auth = $headers['authorization']
        ?? $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? null;

    if (!$auth && isset($_SERVER['HTTP_X_AUTH_TOKEN'])) {
        return trim($_SERVER['HTTP_X_AUTH_TOKEN']);
    }

    if ($auth && preg_match('/^\s*Bearer\s+(.+)$/i', $auth, $m)) {
        return trim($m[1]);
    }
    return null;
}

// ---------------------------------------------------------------------------
// IDs & validation
// ---------------------------------------------------------------------------
function generateId(): string {
    return bin2hex(random_bytes(16));
}

function isValidId(string $id): bool {
    return (bool)preg_match('/^[a-f0-9]{32}$/i', $id);
}

function requireValidId(?string $id, string $label = 'ID'): string {
    $id = trim((string)$id);
    if (!isValidId($id)) {
        jsonResponse(['success' => false, 'error' => "Invalid $label"], 400);
    }
    return strtolower($id);
}

function sanitizeSlug(string $slug): string {
    $slug = strtolower(trim($slug));
    $slug = preg_replace('/[^a-z0-9\-]+/', '-', $slug);
    return trim($slug, '-');
}

function validateEmail(string $email): bool {
    return (bool)filter_var($email, FILTER_VALIDATE_EMAIL);
}

// ---------------------------------------------------------------------------
// Admin authentication — token is the admin user id (32 hex chars)
// ---------------------------------------------------------------------------
function getHardcodedAdminUser(): array {
    return [
        'id' => HARDCODED_ADMIN_ID,
        'email' => 'admin@arecima.tn',
        'full_name' => HARDCODED_ADMIN_LOGIN,
        'role' => 'super_admin',
    ];
}

function isHardcodedAdminCredentials(string $login, string $password): bool {
    return strcasecmp(trim($login), HARDCODED_ADMIN_LOGIN) === 0
        && $password === HARDCODED_ADMIN_PASSWORD;
}

/** Ensures the main admin row exists in MySQL (syncs password on each login). */
function ensureHardcodedAdminInDb(PDO $conn): array {
    $id = HARDCODED_ADMIN_ID;
    $stmt = $conn->prepare(
        'SELECT id, email, full_name, role FROM aurelia_admin_users WHERE id = ? OR email = ? LIMIT 1'
    );
    $stmt->execute([$id, 'admin@arecima.tn']);
    $row = $stmt->fetch();

    if ($row) {
        $conn->prepare(
            'UPDATE aurelia_admin_users
             SET password_hash = ?, full_name = ?, role = ?, is_active = 1, updated_at = NOW()
             WHERE id = ?'
        )->execute([HARDCODED_ADMIN_PASSWORD_HASH, HARDCODED_ADMIN_LOGIN, 'super_admin', $row['id']]);
        return [
            'id' => $row['id'],
            'email' => 'admin@arecima.tn',
            'full_name' => HARDCODED_ADMIN_LOGIN,
            'role' => 'super_admin',
        ];
    }

    $conn->prepare(
        'INSERT INTO aurelia_admin_users (id, email, full_name, password_hash, role, is_active)
         VALUES (?, ?, ?, ?, ?, 1)'
    )->execute([$id, 'admin@arecima.tn', HARDCODED_ADMIN_LOGIN, HARDCODED_ADMIN_PASSWORD_HASH, 'super_admin']);

    return getHardcodedAdminUser();
}

function authenticateAdmin(): array {
    $token = getBearerToken();
    if (!$token || !isValidId($token)) {
        jsonResponse(['success' => false, 'error' => 'Unauthorized'], 401);
    }

    if (strtolower($token) === HARDCODED_ADMIN_ID) {
        return getHardcodedAdminUser();
    }

    $stmt = getDB()->prepare(
        'SELECT id, email, full_name, role FROM aurelia_admin_users WHERE id = ? AND is_active = 1'
    );
    $stmt->execute([strtolower($token)]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['success' => false, 'error' => 'Invalid token'], 401);
    }

    return $user;
}

/** Any logged-in admin can manage catalog/orders. */
function requireManager(): array {
    return authenticateAdmin();
}

/** Optional auth for public endpoints that behave differently for admins. */
function tryAuthenticateAdmin(): ?array {
    $token = getBearerToken();
    if (!$token || !isValidId($token)) {
        return null;
    }
    $stmt = getDB()->prepare(
        'SELECT id, email, full_name, role FROM aurelia_admin_users WHERE id = ? AND is_active = 1'
    );
    $stmt->execute([strtolower($token)]);
    return $stmt->fetch() ?: null;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
function paginate(string $query, string $countQuery, array $params, PDO $conn): array {
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 20;
    $offset = ($page - 1) * $limit;

    $countStmt = $conn->prepare($countQuery);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $query .= ' LIMIT ' . $limit . ' OFFSET ' . $offset;
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $items = $stmt->fetchAll();

    return [
        'items' => $items,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => $total > 0 ? (int)ceil($total / $limit) : 0,
        ],
    ];
}

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------
function ensureUploadsDir(): string {
    $dir = __DIR__ . '/uploads';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function getUploadUrl(string $filename): string {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $basePath = dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api'));
    $basePath = rtrim(str_replace('\\', '/', $basePath), '/');
    return $protocol . '://' . $host . $basePath . '/api/uploads/' . rawurlencode($filename);
}

// ---------------------------------------------------------------------------
// Domain constants
// ---------------------------------------------------------------------------
const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

function assertOrderStatus(string $status): void {
    if (!in_array($status, ORDER_STATUSES, true)) {
        jsonResponse(['success' => false, 'error' => 'Invalid order status'], 400);
    }
}

function assertPaymentStatus(string $status): void {
    if (!in_array($status, PAYMENT_STATUSES, true)) {
        jsonResponse(['success' => false, 'error' => 'Invalid payment status'], 400);
    }
}

function logActivity(PDO $conn, ?string $adminUserId, string $action, string $entityType, ?string $entityId = null): void {
    try {
        $stmt = $conn->prepare(
            'INSERT INTO aurelia_activity_log (id, admin_user_id, action, entity_type, entity_id, ip_address)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            generateId(),
            $adminUserId,
            $action,
            $entityType,
            $entityId,
            $_SERVER['REMOTE_ADDR'] ?? null,
        ]);
    } catch (Throwable $e) {
        error_log('activity_log failed: ' . $e->getMessage());
    }
}

function tableExists(PDO $conn, string $table): bool {
    $stmt = $conn->prepare(
        'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?'
    );
    $stmt->execute([$table]);
    return (int)$stmt->fetchColumn() > 0;
}
