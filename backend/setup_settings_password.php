<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "CREATE TABLE IF NOT EXISTS settings_password (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        current_password VARCHAR(255) NOT NULL,
        new_password VARCHAR(255) NOT NULL,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        backup_codes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user (user_id)
    )";
    $pdo->exec($sql);
    
    echo "Database table 'settings_password' created successfully!";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>