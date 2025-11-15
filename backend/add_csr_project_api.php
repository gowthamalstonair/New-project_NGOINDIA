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
    $required_fields = ['title', 'description', 'category', 'budget', 'duration', 'beneficiaries', 'location'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Validate numeric fields
    if (!is_numeric($input['budget']) || $input['budget'] <= 0) {
        throw new Exception('Budget must be a positive number');
    }
    
    if (!is_numeric($input['beneficiaries']) || $input['beneficiaries'] <= 0) {
        throw new Exception('Beneficiaries must be a positive number');
    }

    // For now, we'll just simulate saving the project
    // In a real implementation, you would save this to a database
    
    $project_data = [
        'title' => $input['title'],
        'description' => $input['description'],
        'category' => $input['category'],
        'budget' => (int)$input['budget'],
        'duration' => $input['duration'],
        'beneficiaries' => (int)$input['beneficiaries'],
        'location' => $input['location'],
        'sdg_goals' => $input['sdgGoals'] ?? '',
        'expected_outcomes' => $input['expectedOutcomes'] ?? '',
        'status' => 'open',
        'created_at' => date('Y-m-d H:i:s'),
        'created_by' => 'admin' // In real app, get from session
    ];

    // Log the project (in a real app, save to database)
    error_log('CSR Project Created: ' . json_encode($project_data));

    $project_id = rand(1000, 9999); // In real app, get from database insert

    echo json_encode([
        'success' => true,
        'message' => 'CSR project created successfully',
        'project_id' => $project_id
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>