
<?php
require_once 'config.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// For admin access, we should check if the user is an admin
// For now, we'll just check if the user is authenticated
if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Get user count
$userStmt = $conn->prepare("SELECT COUNT(*) as total_users FROM users");
$userStmt->execute();
$userResult = $userStmt->get_result();
$totalUsers = $userResult->fetch_assoc()['total_users'];

// Get premium user count
$premiumStmt = $conn->prepare("SELECT COUNT(*) as premium_users FROM users WHERE is_subscribed = 1");
$premiumStmt->execute();
$premiumResult = $premiumStmt->get_result();
$premiumUsers = $premiumResult->fetch_assoc()['premium_users'];

// Get total trials used
$trialStmt = $conn->prepare("SELECT SUM(trial_count) as total_trials FROM users");
$trialStmt->execute();
$trialResult = $trialStmt->get_result();
$totalTrials = $trialResult->fetch_assoc()['total_trials'] ?: 0;

// Return stats
echo json_encode([
    'success' => true,
    'stats' => [
        'totalUsers' => (int)$totalUsers,
        'premiumUsers' => (int)$premiumUsers,
        'freeUsers' => (int)$totalUsers - (int)$premiumUsers,
        'totalTrials' => (int)$totalTrials,
        'conversionRate' => $totalUsers > 0 ? round(($premiumUsers / $totalUsers) * 100, 2) : 0
    ]
]);

$userStmt->close();
$premiumStmt->close();
$trialStmt->close();
$conn->close();
?>
