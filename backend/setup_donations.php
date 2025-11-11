<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        pan_card VARCHAR(10) NOT NULL,
        category ENUM('money', 'things') NOT NULL,
        amount DECIMAL(10,2) NULL,
        things TEXT NULL,
        donor_type ENUM('individual', 'family', 'affiliated', 'corporate', 'grant') NOT NULL,
        
        -- Family member details
        family_member_name VARCHAR(255) NULL,
        family_member_relation VARCHAR(100) NULL,
        family_member_contact VARCHAR(20) NULL,
        
        -- Affiliated details
        affiliated_organization VARCHAR(255) NULL,
        affiliated_position VARCHAR(255) NULL,
        affiliated_contact VARCHAR(20) NULL,
        
        -- Corporate details
        corporate_name VARCHAR(255) NULL,
        corporate_address TEXT NULL,
        corporate_contact VARCHAR(20) NULL,
        corporate_gst VARCHAR(15) NULL,
        
        -- Grant/Foundation details
        foundation_name VARCHAR(255) NULL,
        foundation_address TEXT NULL,
        foundation_contact VARCHAR(20) NULL,
        foundation_registration VARCHAR(100) NULL,
        
        purpose VARCHAR(500) NOT NULL,
        message TEXT NULL,
        payment_method ENUM('card', 'upi', 'netbanking') NULL,
        receipt_number VARCHAR(50) UNIQUE NOT NULL,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    echo "Database table 'donations' created successfully!";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>