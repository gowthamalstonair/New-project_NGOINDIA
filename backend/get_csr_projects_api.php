<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // Mock CSR projects data
    $projects = [
        [
            'id' => '5',
            'title' => 'Rural Education Enhancement',
            'description' => 'Improving educational infrastructure and resources in rural schools',
            'category' => 'Education',
            'budget' => 800000,
            'duration' => '18 months',
            'beneficiaries' => 1200,
            'location' => 'Tamil Nadu, India',
            'sdgGoals' => ['SDG 4: Quality Education', 'SDG 1: No Poverty'],
            'status' => 'open',
            'fundingReceived' => 0,
            'fundUtilized' => 0,
            'images' => [],
            'documents' => [],
            'expectedOutcomes' => ['1200 students benefited', 'Infrastructure improved', 'Teacher training completed'],
            'progress' => 0,
            'milestones' => [],
            'impactData' => [
                'beneficiariesReached' => 0,
                'sdgsAchieved' => [],
                'testimonials' => [],
                'mediaGallery' => []
            ],
            'createdDate' => date('Y-m-d')
        ]
    ];

    echo json_encode([
        'success' => true,
        'projects' => $projects
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to load CSR projects: ' . $e->getMessage()
    ]);
}
?>