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

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

// Validate required fields
$required_fields = ['companyName', 'contactEmail', 'contactPhone', 'csrPolicy', 'focusAreas'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

try {
    $pdo = new PDO('mysql:host=localhost;port=3307;dbname=ngoindia_db', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "INSERT INTO csr_partners (
        company_name, contact_email, contact_phone, website, 
        csr_policy, focus_areas, registration_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['companyName'],
        $input['contactEmail'],
        $input['contactPhone'],
        $input['website'] ?? '',
        $input['csrPolicy'],
        is_array($input['focusAreas']) ? implode(',', $input['focusAreas']) : $input['focusAreas'],
        date('Y-m-d')
    ]);

    $partner_id = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Partner registration submitted successfully',
        'partner_id' => $partner_id
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>