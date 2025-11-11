<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'error' => 'This API only accepts POST requests with JSON data.'
    ]);
    exit;
}

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
        exit;
    }
    
    // Category images mapping
    $categoryImages = [
        'education' => 'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg',
        'healthcare' => 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg',
        'water' => 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
        'food' => 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg',
        'skills' => 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
        'empowerment' => 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
        'environment' => 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
        'emergency' => 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg'
    ];
    
    $stmt = $pdo->prepare("INSERT INTO fund_campaigns (
        title, description, full_story, goal, category, end_date,
        organizer_name, organizer_email, organizer_phone, image_url, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $input['title'] ?? '',
        $input['description'] ?? '',
        $input['fullStory'] ?? '',
        $input['goal'] ?? 0,
        $input['category'] ?? 'education',
        $input['endDate'] ?? '',
        $input['organizerName'] ?? '',
        $input['organizerEmail'] ?? '',
        $input['organizerPhone'] ?? '',
        $categoryImages[$input['category']] ?? $categoryImages['education'],
        'pending'
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Campaign created successfully',
        'campaign_id' => $pdo->lastInsertId()
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>