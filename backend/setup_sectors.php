<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    // Create connection
    $pdo = new PDO("mysql:host=$servername;port=$port", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    $pdo->exec("USE $dbname");
    
    // Create sectors table
    $sql = "CREATE TABLE IF NOT EXISTS sectors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sector_name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(100) DEFAULT 'Target',
        color VARCHAR(50) DEFAULT 'bg-blue-500',
        ngo_count INT DEFAULT 0,
        active_discussions INT DEFAULT 0,
        resources INT DEFAULT 0,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    // Insert default sectors
    $insertSql = "INSERT IGNORE INTO sectors (sector_name, description, icon, color, ngo_count, active_discussions, resources) VALUES
        ('Education', 'Empowering communities through quality education and skill development', 'BookOpen', 'bg-blue-500', 10, 23, 45),
        ('Healthcare', 'Providing accessible healthcare services and medical support', 'Target', 'bg-green-500', 10, 18, 32),
        ('Environment', 'Protecting nature and promoting sustainable development', 'Globe', 'bg-emerald-500', 10, 15, 28),
        ('Women Empowerment', 'Supporting women through skill development and leadership programs', 'Users', 'bg-pink-500', 10, 21, 38)";
    
    $pdo->exec($insertSql);
    
    echo "Database and sectors table setup completed successfully!";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>