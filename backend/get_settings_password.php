<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $user_id = $_GET['user_id'] ?? '';
    
    if (empty($user_id)) {
        echo json_encode([
            'success' => false,
            'error' => 'User ID is required'
        ]);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT user_id, two_factor_enabled, backup_codes, created_at, updated_at FROM settings_password WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($settings) {
        // Parse backup codes from JSON
        $settings['backup_codes'] = json_decode($settings['backup_codes'], true) ?? [];
        
        echo json_encode([
            'success' => true,
            'settings' => $settings
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Settings not found'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>