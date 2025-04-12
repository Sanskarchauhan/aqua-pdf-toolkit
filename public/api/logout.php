
<?php
require_once 'config.php';

// Destroy session
session_unset();
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
?>
