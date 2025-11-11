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

if (empty($input['name']) || empty($input['amount']) || empty($input['purpose'])) {
    echo json_encode(['success' => false, 'error' => 'Name, amount, and purpose are required']);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "INSERT INTO projects (name, description, purpose, amount, budget_allocation, start_date, end_date) 
            VALUES (:name, :description, :purpose, :amount, :budget_allocation, :start_date, :end_date)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        ':name' => $input['name'],
        ':description' => $input['description'] ?? null,
        ':purpose' => $input['purpose'],
        ':amount' => $input['amount'],
        ':budget_allocation' => isset($input['budgetAllocation']) ? json_encode($input['budgetAllocation']) : null,
        ':start_date' => $input['startDate'] ?? null,
        ':end_date' => $input['endDate'] ?? null
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Project created successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to create project']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>