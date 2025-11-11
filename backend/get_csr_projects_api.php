<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;port=3307;dbname=ngoindia_db', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM csr_projects ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format data for frontend
    $formatted_projects = array_map(function($project) {
        return [
            'id' => (string)$project['id'],
            'title' => $project['title'],
            'description' => $project['description'],
            'category' => $project['category'],
            'budget' => (int)$project['budget'],
            'duration' => $project['duration'],
            'beneficiaries' => (int)$project['beneficiaries'],
            'location' => $project['location'],
            'sdgGoals' => $project['sdg_goals'] ? explode(',', $project['sdg_goals']) : [],
            'status' => $project['status'],
            'fundingReceived' => (int)$project['funding_received'],
            'fundUtilized' => (int)$project['fund_utilized'],
            'partnerId' => $project['partner_id'],
            'partnerName' => $project['partner_name'],
            'images' => [],
            'documents' => [],
            'expectedOutcomes' => $project['expected_outcomes'] ? explode(',', $project['expected_outcomes']) : [],
            'progress' => (int)$project['progress'],
            'milestones' => [],
            'impactData' => [
                'beneficiariesReached' => 0,
                'sdgsAchieved' => [],
                'testimonials' => [],
                'mediaGallery' => []
            ],
            'createdDate' => $project['created_date'],
            'startDate' => $project['start_date'],
            'endDate' => $project['end_date']
        ];
    }, $projects);

    echo json_encode([
        'success' => true,
        'projects' => $formatted_projects
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>