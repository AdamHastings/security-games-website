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

// Get the current Unix timestamp with microsecond precision
$microtime = microtime(true);  // Returns float with microseconds precision

// Format the timestamp as seconds.microseconds (e.g., 1724510801.123456)
$timestamp = sprintf('%.6f', $microtime);

// The ELF file or command you want to run
$elf_file = './run/release/run_games';
$config = 'server_config.json'; // replace later with custom config scraped from html form
$logname = "$timestamp.csv";

$command = "$elf_file $config $logname";

echo $timestamp."<br>\n";
echo $command."<br>\n";

// Execute the command using exec()
$return_var = null;
system($command, $return_var);

// Check the result
if ($return_var === 0) {
    echo "Command executed successfully.<br>";
} else {
    echo "Error executing the command. Return code: " . $return_var."<br>\n";
}

// create the plotly figures
$script_command = "./asset_flow_sankey.py $logname";
exec($script_command);
$sankey_filename = "figs/" . $timestamp . "_asset_flow_sankey.html";

// TODO remove
// $sankey_filename = "figs/fullsize_short_asset_flow_sankey.html";
chmod($sankey_filename, 0644);



echo $sankey_filename."<br>\n";

// Check if the file exists
if (file_exists($sankey_filename)) {
    // Read and return the contents of the HTML file
    echo file_get_contents($sankey_filename);
} else {
    // Handle the case where the file doesn't exist
    echo "<h1>Error: The requested HTML file does not exist.</h1>";
}

// unlink($logname);
// unlink($sankey_filename);

?> 
