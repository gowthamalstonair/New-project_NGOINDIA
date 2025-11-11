<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create sector_posts table
    $sql = "CREATE TABLE IF NOT EXISTS sector_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        sector VARCHAR(100) NOT NULL,
        type ENUM('Need Help', 'Can Help') NOT NULL,
        urgency ENUM('Immediate', 'This Week', 'This Month') NOT NULL,
        description TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        responses INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    echo "Database table 'sector_posts' created successfully!";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>