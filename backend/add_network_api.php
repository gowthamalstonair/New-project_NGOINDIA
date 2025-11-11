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

if (empty($input['ngoName']) || empty($input['email'])) {
    echo json_encode(['success' => false, 'error' => 'NGO name and email are required']);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "INSERT INTO networks (ngo_name, email, phone, location, focus_area, description, website, members, projects, logo) 
            VALUES (:ngo_name, :email, :phone, :location, :focus_area, :description, :website, :members, :projects, :logo)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        ':ngo_name' => $input['ngoName'],
        ':email' => $input['email'],
        ':phone' => $input['phone'] ?? null,
        ':location' => $input['location'] ?? null,
        ':focus_area' => $input['focusArea'] ?? null,
        ':description' => $input['description'] ?? null,
        ':website' => $input['website'] ?? null,
        ':members' => $input['members'] ?? 0,
        ':projects' => $input['projects'] ?? 0,
        ':logo' => $input['logo'] ?? null
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Successfully joined the network',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to join network']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>