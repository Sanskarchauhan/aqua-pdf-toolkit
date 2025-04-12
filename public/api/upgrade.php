
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

// Update subscription status
$stmt = $conn->prepare("UPDATE users SET is_subscribed = 1 WHERE id = ?");
$stmt->bind_param("s", $userId);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Subscription activated successfully'
    ]);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => 'Error upgrading subscription']);
}

$stmt->close();
$conn->close();
?>
