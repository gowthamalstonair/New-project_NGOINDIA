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
    $required_fields = ['companyName', 'contactPerson', 'email', 'phone', 'csrArea', 'message'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // For now, we'll just simulate saving the inquiry
    // In a real implementation, you would save this to a database
    
    $inquiry_data = [
        'company_name' => $input['companyName'],
        'contact_person' => $input['contactPerson'],
        'email' => $input['email'],
        'phone' => $input['phone'],
        'csr_area' => $input['csrArea'],
        'budget' => $input['budget'] ?? '',
        'message' => $input['message'],
        'submitted_at' => date('Y-m-d H:i:s'),
        'status' => 'pending'
    ];

    // Log the inquiry (in a real app, save to database)
    error_log('CSR Inquiry Received: ' . json_encode($inquiry_data));

    echo json_encode([
        'success' => true,
        'message' => 'CSR partnership inquiry submitted successfully',
        'inquiry_id' => uniqid('csr_', true)
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>