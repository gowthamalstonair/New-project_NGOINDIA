<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = file_get_contents('create_beneficiary_impact_table.sql');
    $pdo->exec($sql);
    
    echo "Beneficiary impact records table created successfully!";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>