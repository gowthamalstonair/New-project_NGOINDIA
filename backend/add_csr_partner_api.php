<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    $required_fields = ['companyName', 'contactEmail', 'contactPhone', 'csrPolicy', 'focusAreas'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Validate email format
    if (!filter_var($input['contactEmail'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Validate focus areas is array
    if (!is_array($input['focusAreas']) || empty($input['focusAreas'])) {
        throw new Exception('At least one focus area must be selected');
    }

    // For now, we'll just simulate saving the partner
    // In a real implementation, you would save this to a database
    
    $partner_data = [
        'company_name' => $input['companyName'],
        'contact_email' => $input['contactEmail'],
        'contact_phone' => $input['contactPhone'],
        'website' => $input['website'] ?? '',
        'csr_policy' => $input['csrPolicy'],
        'focus_areas' => json_encode($input['focusAreas']),
        'status' => 'pending',
        'registration_date' => date('Y-m-d H:i:s'),
        'rating' => 0,
        'total_funding' => 0,
        'active_projects' => 0,
        'completed_projects' => 0
    ];

    // Log the partner (in a real app, save to database)
    error_log('CSR Partner Registered: ' . json_encode($partner_data));

    $partner_id = rand(1000, 9999); // In real app, get from database insert

    echo json_encode([
        'success' => true,
        'message' => 'CSR partner registration submitted successfully',
        'partner_id' => $partner_id
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>