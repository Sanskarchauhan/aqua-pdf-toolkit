
<?php
require_once 'config.php';

// Only allow POST requests for signup
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize inputs
$name = sanitize_input($data['name']);
$email = sanitize_input($data['email']);
$password = $data['password']; // Will be hashed

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Check if user already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    header('HTTP/1.1 409 Conflict');
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Generate UUID
$id = generate_uuid();

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (id, name, email, password, is_subscribed, trial_count) VALUES (?, ?, ?, ?, 0, 0)");
$stmt->bind_param("ssss", $id, $name, $email, $hashed_password);

if ($stmt->execute()) {
    // Set session data
    $_SESSION['user_id'] = $id;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_name'] = $name;
    
    // Return success response
    echo json_encode([
        'success' => true, 
        'message' => 'User registered successfully',
        'user' => [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'isSubscribed' => false,
            'trialCount' => 0
        ]
    ]);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => 'Error creating user: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
