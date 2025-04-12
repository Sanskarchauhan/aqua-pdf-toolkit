
<?php
require_once 'config.php';

// SQL to create users table
$sql = "CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_subscribed BOOLEAN DEFAULT FALSE,
    trial_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Users table created successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error creating users table: ' . $conn->error]);
}

$conn->close();
?>
