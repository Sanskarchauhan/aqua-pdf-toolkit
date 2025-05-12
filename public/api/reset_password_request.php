
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
if (!isset($data['email'])) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

// Sanitize input
$email = sanitize_input($data['email']);

// Check if user exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Don't reveal if email exists or not for security reasons
    echo json_encode(['success' => true, 'message' => 'If your email is registered, you will receive a password reset link']);
    exit;
}

// Generate reset token
$token = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', time() + 3600); // Token expires in 1 hour
$userId = $result->fetch_assoc()['id'];

// Store reset token in database (you would need to create this table)
$resetStmt = $conn->prepare("INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)
                           ON DUPLICATE KEY UPDATE token = ?, expires_at = ?");
$resetStmt->bind_param("sssss", $userId, $token, $expires, $token, $expires);
$resetStmt->execute();

// In a real application, you would send an email with the reset link
// For this example, we'll just return the token
echo json_encode([
    'success' => true,
    'message' => 'If your email is registered, you will receive a password reset link',
    'debug_token' => $token // Remove this in production
]);

$stmt->close();
$resetStmt->close();
$conn->close();
?>
