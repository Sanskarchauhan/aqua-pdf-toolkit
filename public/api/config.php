
<?php
// Database configuration for Hostinger
$host = 'localhost'; // Usually localhost on Hostinger
$db_name = 'your_database_name'; // Your Hostinger database name
$username = 'your_database_username'; // Your Hostinger database username
$password = 'your_database_password'; // Your Hostinger database password

// Create database connection
$conn = new mysqli($host, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers for JSON responses
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // In production, specify your domain
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Start session
session_start();

// Helper functions
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function generate_uuid() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}
?>
