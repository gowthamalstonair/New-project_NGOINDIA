<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT 
        id, title, description, full_story, goal, raised, category, 
        end_date, organizer_name, organizer_email, organizer_phone, 
        image_url, status, created_at
        FROM fund_campaigns 
        WHERE status = 'approved' 
        ORDER BY created_at DESC");
    
    $stmt->execute();
    $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate days left for each campaign
    foreach ($campaigns as &$campaign) {
        $endDate = new DateTime($campaign['end_date']);
        $today = new DateTime();
        $daysLeft = $today->diff($endDate)->days;
        
        if ($endDate < $today) {
            $daysLeft = 0;
        }
        
        $campaign['daysLeft'] = $daysLeft;
        $campaign['image'] = $campaign['image_url']; // For frontend compatibility
    }
    
    echo json_encode([
        'success' => true,
        'campaigns' => $campaigns
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>