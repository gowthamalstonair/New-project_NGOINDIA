<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM documents ORDER BY created_at DESC");
    $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedDocuments = array_map(function($doc) {
        return [
            'id' => (string)$doc['id'],
            'title' => $doc['title'],
            'ngoName' => $doc['ngo_name'],
            'category' => $doc['category'],
            'type' => $doc['type'],
            'size' => $doc['file_size'],
            'pages' => (int)$doc['pages'],
            'uploadDate' => $doc['upload_date'],
            'downloads' => (int)$doc['downloads'],
            'views' => (int)$doc['views'],
            'image' => $doc['image'],
            'description' => $doc['description'],
            'tags' => $doc['tags'] ? explode(',', $doc['tags']) : [],
            'href' => '#'
        ];
    }, $documents);

    echo json_encode($formattedDocuments);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>