<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$servername = "127.0.0.1";
$db_username = "root";
$db_password = "";
$dbname = "ngoindia_db";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed']);
    exit();
}

$raw_input = file_get_contents('php://input');
$input = json_decode($raw_input, true);

// Validate required fields
$required_fields = ['name', 'email', 'panCard', 'category', 'donorType', 'purpose'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        echo json_encode(['success' => false, 'error' => ucfirst($field) . ' is required']);
        exit();
    }
}

// Validate category-specific fields
if ($input['category'] === 'money' && empty($input['amount'])) {
    echo json_encode(['success' => false, 'error' => 'Amount is required for money donations']);
    exit();
}

if ($input['category'] === 'things' && empty($input['things'])) {
    echo json_encode(['success' => false, 'error' => 'Things description is required']);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$servername;port=3307;dbname=$dbname", $db_username, $db_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Generate receipt number
    $receipt_number = 'NGO-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);
    
    // Prepare SQL
    $sql = "INSERT INTO donations (
        name, email, pan_card, category, amount, things, donor_type,
        family_member_name, family_member_relation, family_member_contact,
        affiliated_organization, affiliated_position, affiliated_contact,
        corporate_name, corporate_address, corporate_contact, corporate_gst,
        foundation_name, foundation_address, foundation_contact, foundation_registration,
        purpose, message, payment_method, receipt_number, status
    ) VALUES (
        :name, :email, :pan_card, :category, :amount, :things, :donor_type,
        :family_member_name, :family_member_relation, :family_member_contact,
        :affiliated_organization, :affiliated_position, :affiliated_contact,
        :corporate_name, :corporate_address, :corporate_contact, :corporate_gst,
        :foundation_name, :foundation_address, :foundation_contact, :foundation_registration,
        :purpose, :message, :payment_method, :receipt_number, :status
    )";
    
    $stmt = $pdo->prepare($sql);
    
    // Execute with data
    $result = $stmt->execute([
        ':name' => $input['name'],
        ':email' => $input['email'],
        ':pan_card' => $input['panCard'],
        ':category' => $input['category'],
        ':amount' => $input['category'] === 'money' ? $input['amount'] : null,
        ':things' => $input['category'] === 'things' ? $input['things'] : null,
        ':donor_type' => $input['donorType'],
        ':family_member_name' => $input['familyMemberName'] ?? null,
        ':family_member_relation' => $input['familyMemberRelation'] ?? null,
        ':family_member_contact' => $input['familyMemberContact'] ?? null,
        ':affiliated_organization' => $input['affiliatedOrganization'] ?? null,
        ':affiliated_position' => $input['affiliatedPosition'] ?? null,
        ':affiliated_contact' => $input['affiliatedContact'] ?? null,
        ':corporate_name' => $input['corporateName'] ?? null,
        ':corporate_address' => $input['corporateAddress'] ?? null,
        ':corporate_contact' => $input['corporateContact'] ?? null,
        ':corporate_gst' => $input['corporateGST'] ?? null,
        ':foundation_name' => $input['foundationName'] ?? null,
        ':foundation_address' => $input['foundationAddress'] ?? null,
        ':foundation_contact' => $input['foundationContact'] ?? null,
        ':foundation_registration' => $input['foundationRegistration'] ?? null,
        ':purpose' => $input['purpose'],
        ':message' => $input['message'] ?? null,
        ':payment_method' => $input['paymentMethod'] ?? null,
        ':receipt_number' => $receipt_number,
        ':status' => 'completed'
    ]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Donation saved successfully',
            'receipt_number' => $receipt_number,
            'donation_id' => $pdo->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to save donation']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>