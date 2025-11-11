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
    
    $stmt = $pdo->prepare("INSERT INTO sector_posts (title, author, sector, type, urgency, description) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $input['title'],
        $input['author'],
        $input['sector'],
        $input['type'],
        $input['urgency'],
        $input['description'] ?? ''
    ]);
    
    $postId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'id' => $postId,
        'message' => 'Sector post created successfully'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>