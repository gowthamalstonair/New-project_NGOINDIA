<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3307", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS ngoindia_db");
    $pdo->exec("USE ngoindia_db");
    
    // Create table
    $sql = "CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        vendor VARCHAR(255),
        invoice_number VARCHAR(100),
        payment_method VARCHAR(50),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    echo "<h2>Success!</h2>";
    echo "<p>Database 'ngoindia_db' and table 'expenses' created successfully!</p>";
    echo "<p>You can now use the Record Expense form.</p>";
    
} catch(PDOException $e) {
    echo "<h2>Error:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<p>Make sure MySQL is running on port 3307</p>";
}
?>