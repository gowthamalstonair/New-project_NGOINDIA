<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3307", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS ngoindia_db");
    $pdo->exec("USE ngoindia_db");
    
    // Create table
    $sql = "CREATE TABLE IF NOT EXISTS donors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donor_name VARCHAR(255) NOT NULL,
        donor_email VARCHAR(255),
        amount DECIMAL(10,2) NOT NULL,
        donation_type VARCHAR(50) NOT NULL,
        purpose VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    echo "<h2>Success!</h2>";
    echo "<p>Database 'ngoindia_db' and table 'donors' created successfully!</p>";
    echo "<p>You can now use the Add Donation form.</p>";
    
} catch(PDOException $e) {
    echo "<h2>Error:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<p>Make sure MySQL is running on port 3307</p>";
}
?>