<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if table exists and has old structure
    $checkTable = $pdo->query("SHOW TABLES LIKE 'post_responses'");
    if ($checkTable->rowCount() > 0) {
        // Check if post_id column exists
        $checkColumn = $pdo->query("SHOW COLUMNS FROM post_responses LIKE 'post_id'");
        if ($checkColumn->rowCount() > 0) {
            // Drop the table and recreate with new structure
            $pdo->exec("DROP TABLE post_responses");
            echo "Dropped existing table with old structure.\n";
        }
    }
    
    // Create table with new structure
    $sql = "CREATE TABLE IF NOT EXISTS post_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_name VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    echo "Database table 'post_responses' updated successfully with post_name column!";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>