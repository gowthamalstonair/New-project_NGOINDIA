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

if (empty($input['donorName']) || empty($input['amount'])) {
    echo json_encode(['success' => false, 'error' => 'Donor name and amount are required']);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "INSERT INTO donors (donor_name, donor_email, amount, donation_type, purpose, notes) 
            VALUES (:donor_name, :donor_email, :amount, :donation_type, :purpose, :notes)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        ':donor_name' => $input['donorName'],
        ':donor_email' => $input['donorEmail'] ?? null,
        ':amount' => $input['amount'],
        ':donation_type' => $input['donationType'],
        ':purpose' => $input['purpose'] ?? null,
        ':notes' => $input['notes'] ?? null
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Donor added successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to add donor']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>