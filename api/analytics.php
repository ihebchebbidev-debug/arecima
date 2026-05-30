<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDB();

switch ($method) {
    case 'GET':
        authenticateAdmin();
        $action = $_GET['action'] ?? 'overview';
        switch ($action) {
            case 'overview':
                getOverview($conn);
                break;
            case 'visitors':
                getVisitors($conn);
                break;
            case 'pages':
                getTopPages($conn);
                break;
            case 'devices':
                getDevices($conn);
                break;
            case 'countries':
                getCountries($conn);
                break;
            case 'referrers':
                getReferrers($conn);
                break;
            default:
                jsonResponse(['success' => false, 'error' => 'Invalid action'], 400);
        }
        break;
    case 'POST':
        trackSession($conn);
        break;
    default:
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function analyticsPeriod(): int {
    $period = (int)($_GET['period'] ?? 30);
    return max(1, min(365, $period));
}

function getOverview(PDO $conn): void {
    $period = analyticsPeriod();
    $stmt = $conn->prepare(
        "SELECT COUNT(*) AS total_sessions,
            COUNT(DISTINCT visitor_id) AS unique_visitors,
            COALESCE(AVG(duration_seconds), 0) AS avg_duration,
            COALESCE(AVG(pages_viewed), 0) AS avg_pages,
            CASE WHEN COUNT(*) > 0
                THEN SUM(CASE WHEN is_bounce = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100
                ELSE 0 END AS bounce_rate
         FROM aurelia_visitor_sessions
         WHERE started_at >= DATE_SUB(NOW(), INTERVAL ? DAY)"
    );
    $stmt->execute([$period]);
    jsonResponse(['success' => true, 'data' => $stmt->fetch()]);
}

function getVisitors(PDO $conn): void {
    $period = analyticsPeriod();
    $stmt = $conn->prepare(
        "SELECT DATE(started_at) AS date, COUNT(*) AS sessions, COUNT(DISTINCT visitor_id) AS visitors
         FROM aurelia_visitor_sessions
         WHERE started_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY DATE(started_at) ORDER BY date"
    );
    $stmt->execute([$period]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getTopPages(PDO $conn): void {
    try {
        $stmt = $conn->query(
            "SELECT page_path, COUNT(*) AS views, COALESCE(AVG(time_on_page_seconds), 0) AS avg_time
             FROM aurelia_page_views
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
             GROUP BY page_path ORDER BY views DESC LIMIT 20"
        );
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
    } catch (Throwable $e) {
        jsonResponse(['success' => true, 'data' => []]);
    }
}

function getDevices(PDO $conn): void {
    $stmt = $conn->query(
        "SELECT device, COUNT(*) AS count FROM aurelia_visitor_sessions
         WHERE started_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         GROUP BY device ORDER BY count DESC"
    );
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getCountries(PDO $conn): void {
    $stmt = $conn->query(
        "SELECT country, COUNT(*) AS count FROM aurelia_visitor_sessions
         WHERE started_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND country IS NOT NULL AND country != ''
         GROUP BY country ORDER BY count DESC LIMIT 20"
    );
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getReferrers(PDO $conn): void {
    $stmt = $conn->query(
        "SELECT referrer_source, COUNT(*) AS count FROM aurelia_visitor_sessions
         WHERE started_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
           AND referrer_source IS NOT NULL AND referrer_source != ''
         GROUP BY referrer_source ORDER BY count DESC LIMIT 20"
    );
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function trackSession(PDO $conn): void {
    try {
        $data = getRequestBody();
        $device = $data['device'] ?? 'desktop';
        if (!in_array($device, ['desktop', 'mobile', 'tablet'], true)) {
            $device = 'desktop';
        }

        $id = generateId();
        $stmt = $conn->prepare(
            "INSERT INTO aurelia_visitor_sessions
            (id, visitor_id, ip_address, device, browser, os, country, city, referrer_source, landing_page, pages_viewed, duration_seconds, is_bounce)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $id,
            mb_substr((string)($data['visitor_id'] ?? generateId()), 0, 255),
            $_SERVER['REMOTE_ADDR'] ?? null,
            $device,
            mb_substr((string)($data['browser'] ?? ''), 0, 100) ?: null,
            mb_substr((string)($data['os'] ?? ''), 0, 100) ?: null,
            mb_substr((string)($data['country'] ?? ''), 0, 100) ?: null,
            mb_substr((string)($data['city'] ?? ''), 0, 100) ?: null,
            mb_substr((string)($data['referrer_source'] ?? ''), 0, 255) ?: null,
            mb_substr((string)($data['landing_page'] ?? '/'), 0, 500),
            max(1, (int)($data['pages_viewed'] ?? 1)),
            max(0, (int)($data['duration_seconds'] ?? 0)),
            (int)($data['is_bounce'] ?? 1) ? 1 : 0,
        ]);
        jsonResponse(['success' => true, 'data' => ['session_id' => $id]], 201);
    } catch (Throwable $e) {
        error_log('trackSession: ' . $e->getMessage());
        jsonResponse(['success' => true, 'data' => []]);
    }
}
