<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "127.0.0.1";
$db_username = "root";
$db_password = "";
$dbname = "ngoindia_db";

try {
    // Test database connection
    $pdo = new PDO("mysql:host=$servername;port=3307;dbname=$dbname", $db_username, $db_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if donations table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'donations'");
    $tableExists = $stmt->rowCount() > 0;
    
    // Get table structure if exists
    $columns = [];
    if ($tableExists) {
        $stmt = $pdo->query("DESCRIBE donations");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful',
        'database' => $dbname,
        'table_exists' => $tableExists,
        'columns' => $columns
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
}
?>