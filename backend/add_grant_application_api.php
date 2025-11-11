<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    $sql = "INSERT INTO grant_applications (
        applicant_name, applicant_email, applicant_phone, organization_name,
        project_title, project_description, requested_amount, project_duration, category
    ) VALUES (
        :applicant_name, :applicant_email, :applicant_phone, :organization_name,
        :project_title, :project_description, :requested_amount, :project_duration, :category
    )";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':applicant_name' => $input['applicantName'],
        ':applicant_email' => $input['applicantEmail'],
        ':applicant_phone' => $input['applicantPhone'] ?? null,
        ':organization_name' => $input['organizationName'] ?? null,
        ':project_title' => $input['projectTitle'],
        ':project_description' => $input['projectDescription'],
        ':requested_amount' => $input['requestedAmount'],
        ':project_duration' => $input['projectDuration'] ?? null,
        ':category' => $input['category']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Grant application submitted successfully',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>