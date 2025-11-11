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
    
    $sql = "INSERT INTO partners (
        name, level, address, country, region, email, phone, 
        description, website, established, status, projects
    ) VALUES (
        :name, :level, :address, :country, :region, :email, :phone,
        :description, :website, :established, :status, :projects
    )";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $input['name'],
        ':level' => $input['level'],
        ':address' => $input['location']['address'] ?? null,
        ':country' => $input['location']['country'] ?? 'India',
        ':region' => $input['location']['region'] ?? null,
        ':email' => $input['contact']['email'] ?? null,
        ':phone' => $input['contact']['phone'] ?? null,
        ':description' => $input['description'] ?? null,
        ':website' => $input['website'] ?? null,
        ':established' => $input['established'] ?? null,
        ':status' => $input['status'] ?? 'pending',
        ':projects' => json_encode($input['projects'] ?? [])
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Partner added successfully',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>