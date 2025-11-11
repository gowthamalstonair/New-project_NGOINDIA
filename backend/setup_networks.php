<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3307", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS ngoindia_db");
    $pdo->exec("USE ngoindia_db");
    
    // Create table
    $sql = "CREATE TABLE IF NOT EXISTS networks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ngo_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        location VARCHAR(255),
        focus_area VARCHAR(100),
        description TEXT,
        website VARCHAR(255),
        members INT DEFAULT 0,
        projects INT DEFAULT 0,
        logo TEXT,
        verified BOOLEAN DEFAULT FALSE,
        rating DECIMAL(2,1) DEFAULT 4.5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    echo "<h2>Success!</h2>";
    echo "<p>Database 'ngoindia_db' and table 'networks' created successfully!</p>";
    echo "<p>You can now use the Join Network form.</p>";
    
} catch(PDOException $e) {
    echo "<h2>Error:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<p>Make sure MySQL is running on port 3307</p>";
}
?>