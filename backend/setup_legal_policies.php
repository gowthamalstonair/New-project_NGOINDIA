<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "CREATE TABLE IF NOT EXISTS legal_policies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        policy_name VARCHAR(255) NOT NULL,
        policy_type VARCHAR(100) NOT NULL,
        description TEXT,
        file_name VARCHAR(255),
        file_path VARCHAR(500),
        file_size INT,
        uploaded_by VARCHAR(100) NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        effective_date DATE,
        expiry_date DATE,
        status ENUM('Active', 'Draft', 'Expired', 'Archived') DEFAULT 'Active',
        version VARCHAR(50) DEFAULT '1.0',
        department VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    echo "Database table 'legal_policies' created successfully!";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>