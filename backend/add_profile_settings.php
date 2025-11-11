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
    
    // Check if record exists for this user
    $checkStmt = $pdo->prepare("SELECT id FROM profile_settings WHERE user_id = ?");
    $checkStmt->execute([$input['user_id']]);
    
    if ($checkStmt->rowCount() > 0) {
        // Update existing record
        $stmt = $pdo->prepare("UPDATE profile_settings SET 
            name = ?, email = ?, phone = ?, address = ?, organization = ?, 
            position = ?, bio = ?, website = ?, linkedin = ?, twitter = ?, 
            profile_image = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE user_id = ?");
        $stmt->execute([
            $input['name'],
            $input['email'],
            $input['phone'],
            $input['address'],
            $input['organization'],
            $input['position'],
            $input['bio'],
            $input['website'],
            $input['linkedin'],
            $input['twitter'],
            $input['profile_image'],
            $input['user_id']
        ]);
    } else {
        // Insert new record
        $stmt = $pdo->prepare("INSERT INTO profile_settings 
            (user_id, name, email, phone, address, organization, position, bio, website, linkedin, twitter, profile_image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['user_id'],
            $input['name'],
            $input['email'],
            $input['phone'],
            $input['address'],
            $input['organization'],
            $input['position'],
            $input['bio'],
            $input['website'],
            $input['linkedin'],
            $input['twitter'],
            $input['profile_image']
        ]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Profile settings saved successfully'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>