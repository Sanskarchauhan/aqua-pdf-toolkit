
<?php
require_once 'config.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$userId = $_SESSION['user_id'];

// Get subscription status
$stmt = $conn->prepare("SELECT is_subscribed, trial_count FROM users WHERE id = ?");
$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

$user = $result->fetch_assoc();
$isSubscribed = (bool)$user['is_subscribed'];
$trialCount = (int)$user['trial_count'];
$trialLimit = 3; // Set your trial limit here
$trialRemaining = max(0, $trialLimit - $trialCount);

echo json_encode([
    'success' => true,
    'subscription' => [
        'isSubscribed' => $isSubscribed,
        'trialCount' => $trialCount,
        'trialLimit' => $trialLimit,
        'trialRemaining' => $trialRemaining,
        'status' => $isSubscribed ? 'active' : ($trialRemaining > 0 ? 'trial' : 'expired')
    ]
]);

$stmt->close();
$conn->close();
?>
