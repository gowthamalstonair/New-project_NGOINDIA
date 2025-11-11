<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if "Quality Education for All" sector exists
    $stmt = $pdo->prepare("SELECT * FROM sectors WHERE sector_name LIKE '%Quality Education%'");
    $stmt->execute();
    $qualityEducationSectors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!empty($qualityEducationSectors)) {
        echo "Found Quality Education sectors:\n";
        foreach ($qualityEducationSectors as $sector) {
            echo "ID: " . $sector['id'] . ", Name: " . $sector['sector_name'] . "\n";
        }
        
        // Delete the "Quality Education for All" sector
        $deleteSql = "DELETE FROM sectors WHERE sector_name LIKE '%Quality Education%'";
        $pdo->exec($deleteSql);
        echo "Deleted Quality Education sectors.\n";
    } else {
        echo "No Quality Education sectors found.\n";
    }
    
    // Show all remaining sectors
    $stmt = $pdo->prepare("SELECT * FROM sectors");
    $stmt->execute();
    $allSectors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\nRemaining sectors:\n";
    foreach ($allSectors as $sector) {
        echo "- " . $sector['sector_name'] . "\n";
    }
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>