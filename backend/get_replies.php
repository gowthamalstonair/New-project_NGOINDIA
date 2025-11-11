<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $discussionId = $_GET['discussion_id'] ?? null;
    
    if (!$discussionId) {
        echo json_encode(['success' => false, 'error' => 'Discussion ID required']);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT *, 
        CASE 
            WHEN TIMESTAMPDIFF(MINUTE, timestamp, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, timestamp, NOW()), ' minutes ago')
            WHEN TIMESTAMPDIFF(HOUR, timestamp, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, timestamp, NOW()), ' hours ago')
            ELSE CONCAT(TIMESTAMPDIFF(DAY, timestamp, NOW()), ' days ago')
        END as time_ago
        FROM discussion_replies WHERE discussion_id = ? ORDER BY timestamp ASC");
    $stmt->execute([$discussionId]);
    $replies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'replies' => $replies]);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>