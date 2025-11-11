<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'error' => 'This API only accepts POST requests with JSON data. Please use the donation form on the website.'
    ]);
    exit;
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
    
    if (!$input) {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
        exit;
    }
    
    // Generate receipt number
    $receipt_number = 'NGO-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);
    
    $stmt = $pdo->prepare("INSERT INTO donations (
        name, email, pan_card, category, amount, things, donor_type,
        family_member_name, family_member_relation, family_member_contact,
        affiliated_organization, affiliated_position, affiliated_contact,
        corporate_name, corporate_address, corporate_contact, corporate_gst,
        foundation_name, foundation_address, foundation_contact, foundation_registration,
        purpose, message, payment_method, receipt_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $input['name'] ?? '',
        $input['email'] ?? '',
        $input['panCard'] ?? '',
        $input['category'] ?? 'money',
        ($input['category'] ?? 'money') === 'money' ? ($input['amount'] ?? 0) : null,
        ($input['category'] ?? 'money') === 'things' ? ($input['things'] ?? '') : null,
        $input['donorType'] ?? 'individual',
        $input['familyMemberName'] ?? null,
        $input['familyMemberRelation'] ?? null,
        $input['familyMemberContact'] ?? null,
        $input['affiliatedOrganization'] ?? null,
        $input['affiliatedPosition'] ?? null,
        $input['affiliatedContact'] ?? null,
        $input['corporateName'] ?? null,
        $input['corporateAddress'] ?? null,
        $input['corporateContact'] ?? null,
        $input['corporateGST'] ?? null,
        $input['foundationName'] ?? null,
        $input['foundationAddress'] ?? null,
        $input['foundationContact'] ?? null,
        $input['foundationRegistration'] ?? null,
        $input['purpose'] ?? '',
        $input['message'] ?? null,
        $input['paymentMethod'] ?? null,
        $receipt_number
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Donation added successfully',
        'receipt_number' => $receipt_number,
        'donation_id' => $pdo->lastInsertId()
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>