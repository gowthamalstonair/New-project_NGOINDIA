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

if (empty($input['beneficiaryName']) || empty($input['projectName']) || empty($input['indicatorName'])) {
    echo json_encode(['success' => false, 'error' => 'Beneficiary name, project name, and indicator name are required']);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "INSERT INTO beneficiary_impact_records (beneficiary_name, project_name, indicator_name, baseline_value, current_value, measurement_date, remarks) 
            VALUES (:beneficiary_name, :project_name, :indicator_name, :baseline_value, :current_value, :measurement_date, :remarks)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        ':beneficiary_name' => $input['beneficiaryName'],
        ':project_name' => $input['projectName'],
        ':indicator_name' => $input['indicatorName'],
        ':baseline_value' => $input['baselineValue'] ?? 0,
        ':current_value' => $input['currentValue'] ?? 0,
        ':measurement_date' => $input['measurementDate'] ?? date('Y-m-d'),
        ':remarks' => $input['remarks'] ?? null
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Impact record added successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to add impact record']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>