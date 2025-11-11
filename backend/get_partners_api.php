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

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "SELECT * FROM partners ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert to frontend format
    foreach ($partners as &$partner) {
        $partner['projects'] = json_decode($partner['projects'] ?? '[]', true);
        $partner['location'] = [
            'address' => $partner['address'],
            'country' => $partner['country'],
            'region' => $partner['region']
        ];
        $partner['contact'] = [
            'email' => $partner['email'],
            'phone' => $partner['phone']
        ];
        
        // Remove redundant fields
        unset($partner['address'], $partner['country'], $partner['region'], $partner['email'], $partner['phone']);
    }
    
    echo json_encode([
        'success' => true,
        'partners' => $partners
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>