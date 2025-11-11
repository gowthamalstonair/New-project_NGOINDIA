<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3307", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS ngoindia_db");
    $pdo->exec("USE ngoindia_db");
    
    // Create table
    $sql = "CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        purpose VARCHAR(100) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        budget_allocation JSON,
        status VARCHAR(50) DEFAULT 'active',
        progress INT DEFAULT 0,
        spent DECIMAL(15,2) DEFAULT 0.00,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    echo "<h2>Success!</h2>";
    echo "<p>Database 'ngoindia_db' and table 'projects' created successfully!</p>";
    echo "<p>You can now use the Create Project form.</p>";
    
} catch(PDOException $e) {
    echo "<h2>Error:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<p>Make sure MySQL is running on port 3307</p>";
}
?>