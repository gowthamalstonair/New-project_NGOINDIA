<?php
try {
    $pdo = new PDO("mysql:host=localhost;port=3307", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS ngoindia_db");
    $pdo->exec("USE ngoindia_db");
    
    // Create donations table
    $sql = "CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        pan_card VARCHAR(10) NOT NULL,
        category ENUM('money', 'things') NOT NULL,
        amount DECIMAL(10,2) NULL,
        things TEXT NULL,
        donor_type VARCHAR(50) NOT NULL,
        purpose VARCHAR(500) NOT NULL,
        message TEXT NULL,
        receipt_number VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo "✅ Database and donations table created successfully!<br>";
    echo "✅ Ready to accept donations via MySQL!";
    
} catch(Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>