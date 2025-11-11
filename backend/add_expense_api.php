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

if (empty($input['title']) || empty($input['amount'])) {
    echo json_encode(['success' => false, 'error' => 'Title and amount are required']);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "INSERT INTO expenses (title, amount, category, description, vendor, invoice_number, payment_method, notes, status) 
            VALUES (:title, :amount, :category, :description, :vendor, :invoice_number, :payment_method, :notes, :status)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        ':title' => $input['title'],
        ':amount' => $input['amount'],
        ':category' => $input['category'],
        ':description' => $input['description'] ?? null,
        ':vendor' => $input['vendor'] ?? null,
        ':invoice_number' => $input['invoiceNumber'] ?? null,
        ':payment_method' => $input['paymentMethod'] ?? null,
        ':notes' => $input['notes'] ?? null,
        ':status' => 'pending'
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Expense recorded successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to record expense']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>