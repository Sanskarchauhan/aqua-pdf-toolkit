
<?php
require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['token']) || !isset($data['password'])) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Token and password are required']);
    exit;
}

$token = sanitize_input($data['token']);
$password = $data['password'];

// Validate token
$stmt = $conn->prepare("SELECT user_id FROM password_resets WHERE token = ? AND expires_at > NOW()");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
    exit;
}

$userId = $result->fetch_assoc()['user_id'];

// Hash the new password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Update user's password
$updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$updateStmt->bind_param("ss", $hashedPassword, $userId);
$updateStmt->execute();

// Delete used token
$deleteStmt = $conn->prepare("DELETE FROM password_resets WHERE token = ?");
$deleteStmt->bind_param("s", $token);
$deleteStmt->execute();

echo json_encode([
    'success' => true,
    'message' => 'Password has been reset successfully'
]);

$stmt->close();
$updateStmt->close();
$deleteStmt->close();
$conn->close();
?>
