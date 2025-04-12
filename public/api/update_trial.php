
<?php
require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);
$userId = isset($data['userId']) ? sanitize_input($data['userId']) : $_SESSION['user_id'];

// Verify user ID matches session
if ($userId !== $_SESSION['user_id']) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['success' => false, 'message' => 'Access denied']);
    exit;
}

// Get current trial count
$stmt = $conn->prepare("SELECT trial_count, is_subscribed FROM users WHERE id = ?");
$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

$user = $result->fetch_assoc();

// Only update trial count if user is not subscribed
if (!(bool)$user['is_subscribed']) {
    $newTrialCount = $user['trial_count'] + 1;
    
    // Update trial count
    $updateStmt = $conn->prepare("UPDATE users SET trial_count = ? WHERE id = ?");
    $updateStmt->bind_param("is", $newTrialCount, $userId);
    
    if ($updateStmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Trial count updated successfully',
            'trialCount' => $newTrialCount
        ]);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'message' => 'Error updating trial count']);
    }
    $updateStmt->close();
} else {
    // User is subscribed, no need to increment trial
    echo json_encode([
        'success' => true,
        'message' => 'User is subscribed, no trial count update needed',
        'trialCount' => $user['trial_count']
    ]);
}

$stmt->close();
$conn->close();
?>
