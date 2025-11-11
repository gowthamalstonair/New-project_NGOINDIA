<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "ngoindia_db";
$port = 3307;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Handle approve/reject actions
    if (isset($_GET['action']) && isset($_GET['id'])) {
        $action = $_GET['action'];
        $id = $_GET['id'];
        
        if ($action === 'approve') {
            $stmt = $pdo->prepare("UPDATE fund_campaigns SET status = 'approved' WHERE id = ?");
            $stmt->execute([$id]);
            echo "<script>alert('Campaign approved!'); window.location.href='admin_campaigns.php';</script>";
        } elseif ($action === 'reject') {
            $stmt = $pdo->prepare("UPDATE fund_campaigns SET status = 'rejected' WHERE id = ?");
            $stmt->execute([$id]);
            echo "<script>alert('Campaign rejected!'); window.location.href='admin_campaigns.php';</script>";
        }
    }
    
    // Get all campaigns
    $stmt = $pdo->prepare("SELECT * FROM fund_campaigns ORDER BY created_at DESC");
    $stmt->execute();
    $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Campaign Admin</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .pending { background-color: #fff3cd; }
        .approved { background-color: #d4edda; }
        .rejected { background-color: #f8d7da; }
        .btn { padding: 5px 10px; margin: 2px; text-decoration: none; border-radius: 3px; }
        .approve { background-color: #28a745; color: white; }
        .reject { background-color: #dc3545; color: white; }
    </style>
</head>
<body>
    <h1>Campaign Administration</h1>
    <p><a href="/NGO-India/">← Back to Website</a></p>
    
    <table>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Goal</th>
            <th>Organizer</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>
        <?php foreach ($campaigns as $campaign): ?>
        <tr class="<?php echo $campaign['status']; ?>">
            <td><?php echo $campaign['id']; ?></td>
            <td><?php echo htmlspecialchars($campaign['title']); ?></td>
            <td><?php echo $campaign['category']; ?></td>
            <td>₹<?php echo number_format($campaign['goal']); ?></td>
            <td><?php echo htmlspecialchars($campaign['organizer_name']); ?></td>
            <td><?php echo ucfirst($campaign['status']); ?></td>
            <td><?php echo date('Y-m-d', strtotime($campaign['created_at'])); ?></td>
            <td>
                <?php if ($campaign['status'] === 'pending'): ?>
                    <a href="?action=approve&id=<?php echo $campaign['id']; ?>" class="btn approve">Approve</a>
                    <a href="?action=reject&id=<?php echo $campaign['id']; ?>" class="btn reject">Reject</a>
                <?php else: ?>
                    <?php echo ucfirst($campaign['status']); ?>
                <?php endif; ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>