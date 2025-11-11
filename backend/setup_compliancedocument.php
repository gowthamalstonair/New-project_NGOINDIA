<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $port = "3307";

    // Connect without database first
    $conn = new PDO("mysql:host=$servername;port=$port", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database
    $conn->exec("CREATE DATABASE IF NOT EXISTS ngoindia_db");
    
    // Connect to the database
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=ngoindia_db", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create table
    $sql = "CREATE TABLE IF NOT EXISTS compliancedocument (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_size INT NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uploaded_by VARCHAR(100) NOT NULL
    )";
    
    $conn->exec($sql);

    echo json_encode([
        'success' => true,
        'message' => 'Database and table created successfully'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>