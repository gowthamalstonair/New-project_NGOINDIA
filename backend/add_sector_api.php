<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['sectorName'])) {
    echo json_encode(['success' => false, 'error' => 'Sector name is required']);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if sector already exists
    $checkSql = "SELECT id FROM sectors WHERE sector_name = :sector_name";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([':sector_name' => $input['sectorName']]);
    
    if ($checkStmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Sector already exists']);
        exit();
    }
    
    $sql = "INSERT INTO sectors (sector_name, description, created_by) 
            VALUES (:sector_name, :description, :created_by)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        ':sector_name' => $input['sectorName'],
        ':description' => $input['description'] ?? 'New sector for specialized collaboration',
        ':created_by' => $input['createdBy'] ?? 'System'
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Sector added successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to add sector']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>