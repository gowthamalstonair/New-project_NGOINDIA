<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$servername = "127.0.0.1";
$db_username = "root";
$db_password = "";
$dbname = "ngoindia_db";

$raw_input = file_get_contents('php://input');
$input = json_decode($raw_input, true);

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Email and password required']);
    exit();
}

// Hardcoded login for now since MySQL is not running
if ($email === 'staff@ngoindia.org' && $password === 'Ngoindia123@') {
    echo json_encode(['success' => true, 'user' => ['id' => '1', 'name' => 'NGO India Staff', 'email' => $email, 'role' => 'staff']]);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$servername;port=3306;dbname=$dbname", $db_username, $db_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT * FROM staff_login WHERE email_address = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && $user['password'] === $password) {
        echo json_encode(['success' => true, 'user' => ['id' => $user['id'] ?? '1', 'name' => $user['name'] ?? 'NGO India Staff', 'email' => $email, 'role' => 'staff']]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>