<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

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

    if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No file uploaded or upload error');
    }

    $file = $_FILES['document'];
    $fileName = $file['name'];
    $fileSize = $file['size'];
    $fileTmpName = $file['tmp_name'];
    
    // Create uploads directory if it doesn't exist
    $uploadDir = '../uploads/documents/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    // Generate unique filename
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $uniqueFileName = uniqid() . '_' . time() . '.' . $fileExtension;
    $filePath = $uploadDir . $uniqueFileName;
    
    // Move uploaded file
    if (!move_uploaded_file($fileTmpName, $filePath)) {
        throw new Exception('Failed to move uploaded file');
    }

    // Get name from POST data
    $name = $_POST['name'] ?? 'Untitled Document';
    
    // Insert into database
    $stmt = $conn->prepare("INSERT INTO compliancedocument (name, file_path, file_size, uploaded_by) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $filePath, $fileSize, 'Admin']);
    
    $documentId = $conn->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Document uploaded successfully',
        'id' => $documentId
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>