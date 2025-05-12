
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

$userId = $_SESSION['user_id'];

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['name'])) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Name is required']);
    exit;
}

// Sanitize input
$name = sanitize_input($data['name']);

// Update user profile
$stmt = $conn->prepare("UPDATE users SET name = ? WHERE id = ?");
$stmt->bind_param("ss", $name, $userId);

if ($stmt->execute()) {
    // Update session data
    $_SESSION['user_name'] = $name;
    
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully',
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $_SESSION['user_email']
        ]
    ]);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => 'Error updating profile']);
}

$stmt->close();
$conn->close();
?>
