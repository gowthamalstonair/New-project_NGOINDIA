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
    
    $stmt = $pdo->prepare("SELECT *, 
        CASE 
            WHEN TIMESTAMPDIFF(DAY, upload_date, NOW()) < 1 THEN 'Today'
            WHEN TIMESTAMPDIFF(DAY, upload_date, NOW()) < 7 THEN CONCAT(TIMESTAMPDIFF(DAY, upload_date, NOW()), ' days ago')
            WHEN TIMESTAMPDIFF(DAY, upload_date, NOW()) < 30 THEN CONCAT(TIMESTAMPDIFF(WEEK, upload_date, NOW()), ' weeks ago')
            ELSE CONCAT(TIMESTAMPDIFF(MONTH, upload_date, NOW()), ' months ago')
        END as time_ago
        FROM legal_policies ORDER BY upload_date DESC");
    $stmt->execute();
    $policies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'policies' => $policies]);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>