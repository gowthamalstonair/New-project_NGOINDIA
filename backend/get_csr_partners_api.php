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

    $sql = "SELECT * FROM csr_partners ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format data for frontend
    $formatted_partners = array_map(function($partner) {
        return [
            'id' => (string)$partner['id'],
            'companyName' => $partner['company_name'],
            'contactEmail' => $partner['contact_email'],
            'contactPhone' => $partner['contact_phone'],
            'website' => $partner['website'],
            'focusAreas' => $partner['focus_areas'] ? explode(',', $partner['focus_areas']) : [],
            'status' => $partner['status'],
            'registrationDate' => $partner['registration_date'],
            'csrPolicy' => $partner['csr_policy'],
            'rating' => (float)$partner['rating'],
            'totalFunding' => (int)$partner['total_funding'],
            'activeProjects' => (int)$partner['active_projects'],
            'completedProjects' => (int)$partner['completed_projects']
        ];
    }, $partners);

    echo json_encode([
        'success' => true,
        'partners' => $formatted_partners
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>