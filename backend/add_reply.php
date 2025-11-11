<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed']);
    exit;
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
    
    if (!$input || !isset($input['discussion_id']) || !isset($input['author']) || !isset($input['content'])) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }
    
    // Add reply
    $stmt = $pdo->prepare("INSERT INTO discussion_replies (discussion_id, author, content) VALUES (?, ?, ?)");
    $stmt->execute([
        $input['discussion_id'],
        $input['author'],
        $input['content']
    ]);
    
    // Update reply count in discussion
    $stmt = $pdo->prepare("UPDATE sector_discussion SET replies = (SELECT COUNT(*) FROM discussion_replies WHERE discussion_id = ?) WHERE id = ?");
    $stmt->execute([$input['discussion_id'], $input['discussion_id']]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>