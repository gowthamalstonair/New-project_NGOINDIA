<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Hash the passwords for security
    $hashedCurrentPassword = password_hash($input['current_password'], PASSWORD_DEFAULT);
    $hashedNewPassword = password_hash($input['new_password'], PASSWORD_DEFAULT);
    
    // Convert backup codes array to JSON string
    $backupCodesJson = json_encode($input['backup_codes'] ?? []);
    
    // Check if record exists for this user
    $checkStmt = $pdo->prepare("SELECT id FROM settings_password WHERE user_id = ?");
    $checkStmt->execute([$input['user_id']]);
    
    if ($checkStmt->rowCount() > 0) {
        // Update existing record
        $stmt = $pdo->prepare("UPDATE settings_password SET 
            current_password = ?, new_password = ?, two_factor_enabled = ?, 
            backup_codes = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE user_id = ?");
        $stmt->execute([
            $hashedCurrentPassword,
            $hashedNewPassword,
            $input['two_factor_enabled'] ? 1 : 0,
            $backupCodesJson,
            $input['user_id']
        ]);
    } else {
        // Insert new record
        $stmt = $pdo->prepare("INSERT INTO settings_password 
            (user_id, current_password, new_password, two_factor_enabled, backup_codes) 
            VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['user_id'],
            $hashedCurrentPassword,
            $hashedNewPassword,
            $input['two_factor_enabled'] ? 1 : 0,
            $backupCodesJson
        ]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Password settings updated successfully'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>