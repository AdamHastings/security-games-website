<?php
// Set content type to JSON
header('Content-Type: application/json');

// Read the incoming JSON data
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    file_put_contents('configs/log.txt', print_r($data, true));  // For debugging
    $filename = 'configs/data_' . time() . '.json';
    file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to parse data']);
}
?>