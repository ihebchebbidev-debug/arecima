<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

authenticateAdmin();
$conn = getDB();

$action = $_GET['action'] ?? 'stats';

switch ($action) {
    case 'stats': getStats($conn); break;
    case 'recent_orders': getRecentOrders($conn); break;
    case 'top_products': getTopProducts($conn); break;
    case 'revenue_chart': getRevenueChart($conn); break;
    case 'low_stock': getLowStock($conn); break;
    default: jsonResponse(['success' => false, 'error' => 'Invalid action'], 400);
}

function getStats($conn) {
    $stats = [];

    // Total revenue
    $stmt = $conn->query("SELECT COALESCE(SUM(total), 0) as total FROM aurelia_orders WHERE payment_status = 'paid'");
    $stats['total_revenue'] = (float)$stmt->fetch()['total'];

    // Today's revenue
    $stmt = $conn->query("SELECT COALESCE(SUM(total), 0) as total FROM aurelia_orders WHERE payment_status = 'paid' AND DATE(created_at) = CURDATE()");
    $stats['today_revenue'] = (float)$stmt->fetch()['total'];

    // Total orders
    $stmt = $conn->query("SELECT COUNT(*) as count FROM aurelia_orders");
    $stats['total_orders'] = (int)$stmt->fetch()['count'];

    // Pending orders
    $stmt = $conn->query("SELECT COUNT(*) as count FROM aurelia_orders WHERE status = 'pending'");
    $stats['pending_orders'] = (int)$stmt->fetch()['count'];

    // Total customers
    $stmt = $conn->query("SELECT COUNT(*) as count FROM aurelia_customers");
    $stats['total_customers'] = (int)$stmt->fetch()['count'];

    // Total products
    $stmt = $conn->query("SELECT COUNT(*) as count FROM aurelia_products WHERE is_active = 1");
    $stats['active_products'] = (int)$stmt->fetch()['count'];

    // Low stock
    $stmt = $conn->query("SELECT COUNT(*) as count FROM aurelia_products WHERE stock <= low_stock_threshold AND is_active = 1");
    $stats['low_stock_count'] = (int)$stmt->fetch()['count'];

    // Newsletter subscribers
    $stmt = $conn->query("SELECT COUNT(*) as count FROM aurelia_newsletter_subscribers WHERE is_active = 1");
    $stats['newsletter_subscribers'] = (int)$stmt->fetch()['count'];

    jsonResponse(['success' => true, 'data' => $stats]);
}

function getRecentOrders($conn) {
    $stmt = $conn->prepare("SELECT id, order_number, customer_name, status, payment_status, total, created_at 
        FROM aurelia_orders ORDER BY created_at DESC LIMIT 10");
    $stmt->execute();
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getTopProducts($conn) {
    $stmt = $conn->prepare("SELECT p.id, p.name_fr, p.price, p.stock,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(SUM(oi.total), 0) as total_revenue
        FROM aurelia_products p
        LEFT JOIN aurelia_order_items oi ON p.id = oi.product_id
        GROUP BY p.id ORDER BY total_sold DESC LIMIT 10");
    $stmt->execute();
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getRevenueChart($conn) {
    $period = $_GET['period'] ?? '30days';
    
    if ($period === '7days') {
        $stmt = $conn->query("SELECT DATE(created_at) as date, COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
            FROM aurelia_orders WHERE payment_status = 'paid' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at) ORDER BY date");
    } elseif ($period === '12months') {
        $stmt = $conn->query("SELECT DATE_FORMAT(created_at, '%Y-%m') as date, COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
            FROM aurelia_orders WHERE payment_status = 'paid' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY date");
    } else {
        $stmt = $conn->query("SELECT DATE(created_at) as date, COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
            FROM aurelia_orders WHERE payment_status = 'paid' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at) ORDER BY date");
    }

    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

function getLowStock($conn) {
    $stmt = $conn->prepare("SELECT id, name_fr, name_fr AS name, sku, stock, low_stock_threshold 
        FROM aurelia_products WHERE stock <= low_stock_threshold AND is_active = 1 ORDER BY stock ASC LIMIT 20");
    $stmt->execute();
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}
?>
