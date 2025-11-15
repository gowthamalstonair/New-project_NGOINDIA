<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // Mock CSR partners data for admin module
    $partners = [
        [
            'id' => '5',
            'companyName' => 'Digital Solutions Inc',
            'contactEmail' => 'csr@digitalsolutions.com',
            'contactPhone' => '+91-9876543214',
            'website' => 'www.digitalsolutions.com',
            'focusAreas' => ['Education', 'Technology', 'Digital Literacy'],
            'status' => 'pending',
            'registrationDate' => date('Y-m-d'),
            'csrPolicy' => 'Committed to bridging the digital divide through technology education and access programs',
            'rating' => 0,
            'totalFunding' => 0,
            'activeProjects' => 0,
            'completedProjects' => 0
        ]
    ];

    echo json_encode([
        'success' => true,
        'partners' => $partners
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to load CSR partners: ' . $e->getMessage()
    ]);
}
?>