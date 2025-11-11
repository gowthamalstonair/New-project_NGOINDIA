<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
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

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("INSERT INTO legal_policies (policy_name, policy_type, description, file_name, file_path, file_size, uploaded_by, effective_date, expiry_date, status, version, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $input['policy_name'],
        $input['policy_type'],
        $input['description'] ?? '',
        $input['file_name'] ?? '',
        $input['file_path'] ?? '',
        $input['file_size'] ?? 0,
        $input['uploaded_by'],
        $input['effective_date'] ?? null,
        $input['expiry_date'] ?? null,
        $input['status'] ?? 'Active',
        $input['version'] ?? '1.0',
        $input['department'] ?? ''
    ]);
    
    $policyId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'id' => $policyId,
        'message' => 'Legal policy uploaded successfully'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>