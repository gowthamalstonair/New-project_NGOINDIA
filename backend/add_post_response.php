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
    
    // Insert response
    $stmt = $pdo->prepare("INSERT INTO post_responses (post_name, name, organization, email, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $input['post_name'],
        $input['name'],
        $input['organization'],
        $input['email'],
        $input['message']
    ]);
    
    // Update response count in sector_posts
    $updateStmt = $pdo->prepare("UPDATE sector_posts SET responses = responses + 1 WHERE title = ?");
    $updateStmt->execute([$input['post_name']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Response added successfully'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>