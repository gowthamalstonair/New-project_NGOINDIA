<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "ngoindia_db";

    // First connect without database to create it
    $conn = new PDO("mysql:host=$servername;port=3307", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $conn->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    
    // Now connect to the database
    $conn = new PDO("mysql:host=$servername;port=3307;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create table if it doesn't exist
    $conn->exec("CREATE TABLE IF NOT EXISTS compliancedocument (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_size INT NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uploaded_by VARCHAR(100) NOT NULL
    )");

    $stmt = $conn->prepare("SELECT * FROM compliancedocument ORDER BY upload_date DESC");
    $stmt->execute();
    $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $documents
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>