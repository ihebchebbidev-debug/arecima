<?php

require_once __DIR__ . '/config.php';



$method = $_SERVER['REQUEST_METHOD'];

$conn = getDB();



if ($method !== 'POST') {

    jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);

}



$data = getRequestBody();

$action = $data['action'] ?? $_GET['action'] ?? '';



switch ($action) {

    case 'login':

        login($conn, $data);

        break;

    case 'logout':

        jsonResponse(['success' => true, 'message' => 'Logged out']);

        break;

    case 'me':

        me();

        break;

    case 'change_password':

        changePassword($conn, $data);

        break;

    default:

        jsonResponse(['success' => false, 'error' => 'Invalid action'], 400);

}



function login(PDO $conn, array $data): void {

    $login = trim($data['email'] ?? $data['login'] ?? '');

    $password = $data['password'] ?? '';



    if ($login === '' || $password === '') {

        jsonResponse(['success' => false, 'error' => 'Login and password required'], 400);

    }



    // Hardcoded main admin: Admin / Admin@2026

    if (isHardcodedAdminCredentials($login, $password)) {

        $user = ensureHardcodedAdminInDb($conn);

        $conn->prepare('UPDATE aurelia_admin_users SET last_login_at = NOW() WHERE id = ?')

            ->execute([$user['id']]);

        logActivity($conn, $user['id'], 'login', 'admin_user', $user['id']);

        jsonResponse([

            'success' => true,

            'data' => ['token' => $user['id'], 'user' => $user],

        ]);

    }



    $stmt = $conn->prepare(

        'SELECT * FROM aurelia_admin_users

         WHERE is_active = 1 AND (email = ? OR LOWER(full_name) = LOWER(?))'

    );

    $stmt->execute([$login, $login]);

    $user = $stmt->fetch();



    if (!$user || !password_verify($password, $user['password_hash'])) {

        jsonResponse(['success' => false, 'error' => 'Invalid credentials'], 401);

    }



    $conn->prepare('UPDATE aurelia_admin_users SET last_login_at = NOW() WHERE id = ?')

        ->execute([$user['id']]);



    logActivity($conn, $user['id'], 'login', 'admin_user', $user['id']);



    unset($user['password_hash']);

    jsonResponse([

        'success' => true,

        'data' => ['token' => $user['id'], 'user' => $user],

    ]);

}



function me(): void {

    $user = authenticateAdmin();

    jsonResponse(['success' => true, 'data' => $user]);

}



function changePassword(PDO $conn, array $data): void {

    $user = authenticateAdmin();



    $current = $data['current_password'] ?? '';

    $new = $data['new_password'] ?? '';



    if ($current === '' || $new === '') {

        jsonResponse(['success' => false, 'error' => 'Both passwords required'], 400);

    }



    if (strlen($new) < 4) {

        jsonResponse(['success' => false, 'error' => 'New password must be at least 4 characters'], 400);

    }



    $stmt = $conn->prepare('SELECT password_hash FROM aurelia_admin_users WHERE id = ?');

    $stmt->execute([$user['id']]);

    $row = $stmt->fetch();



    if (!$row || !password_verify($current, $row['password_hash'])) {

        jsonResponse(['success' => false, 'error' => 'Current password incorrect'], 400);

    }



    $hash = password_hash($new, PASSWORD_DEFAULT);

    $conn->prepare('UPDATE aurelia_admin_users SET password_hash = ?, updated_at = NOW() WHERE id = ?')

        ->execute([$hash, $user['id']]);



    logActivity($conn, $user['id'], 'change_password', 'admin_user', $user['id']);

    jsonResponse(['success' => true, 'message' => 'Password changed']);

}

