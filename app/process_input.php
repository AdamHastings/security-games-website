<?php

// Set content type to JSON
header('Content-Type: application/json');

// Get the current Unix timestamp with microsecond precision
$microtime = microtime(true);  // Returns float with microseconds precision

// Format the timestamp as seconds.microseconds (e.g., 1724510801.123456)
$timestamp = sprintf('%.6f', $microtime);

$config_filename = 'configs/data_' . $timestamp . '.json';


// // // Read the incoming JSON data
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    // file_put_contents('configs/log.txt', print_r($data, true));  // For debugging
    file_put_contents($config_filename, json_encode($data, JSON_PRETTY_PRINT));
    // echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to parse data']);
}

// // TODO delete
$config_filename = 'configs/server_config.json';


// // // The ELF file or command you want to run
$elf_file = './run/release/run_games';
// $logname = "logs/$timestamp.csv";


// //TODO erase
$logname = "logs/server_config.csv";

// chmod($logname, 0644);


$command = "$elf_file $config_filename";

// // echo $timestamp."<br>\n";
// // echo $command."<br>\n";

// // Execute the command using exec()
$return_var = null;
exec($command, $return_var);

// // Check the result
// // if ($return_var === 0) {
// //     echo "Command executed successfully.<br>";
// // } else {
// //     echo "Error executing the command. Return code: " . $return_var."<br>";
// // }

// // create the plotly figures
$script_command = "./asset_flow_sankey.py $logname";
// // $pythonresponse = exec($script_command);


// $sankey_filename = "figs/" . $timestamp . "_asset_flow_sankey.html";

$sankey_filename = "figs/server_config_asset_flow_sankey.html";

chmod($sankey_filename, 0644);



// // echo $sankey_filename."<br>\n";

// $response = $response . $sankey_filename;



// Check if the file exists
if (file_exists($sankey_filename)) {
    // Read and return the contents of the HTML file
    $sankeyhtml = file_get_contents($sankey_filename);
} else {
    // Handle the case where the file doesn't exist
    $sankeyhtml = "<h1>Error: The requested HTML file does not exist.</h1>";
}

// unlink($config_filename);
// unlink($logname);
// unlink($sankey_filename);


// echo json_encode($response);

$htmlContent = "<h2>This is the content inside the iframe</h2>";
$response = array(
    "sankeyhtml" => $sankeyhtml,
    "logname" => $logname,
    "script_command" => $script_command,
    "config_filename" => $config_filename,
    "sankey_filename" => $sankey_filename,
    "command" => $command
);
echo json_encode($response);
?> 
