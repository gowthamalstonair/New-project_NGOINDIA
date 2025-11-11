<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create discussion table
    $sql = "CREATE TABLE IF NOT EXISTS sector_discussion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        sector VARCHAR(100) NOT NULL,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        likes INT DEFAULT 0,
        replies INT DEFAULT 0,
        is_pinned BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    // Create replies table
    $sql = "CREATE TABLE IF NOT EXISTS discussion_replies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discussion_id INT NOT NULL,
        author VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        likes INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (discussion_id) REFERENCES sector_discussion(id) ON DELETE CASCADE
    )";
    $pdo->exec($sql);
    
    echo "Database tables 'sector_discussion' and 'discussion_replies' created successfully!";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>