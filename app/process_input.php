<?php

// Set content type to JSON
header('Content-Type: application/json');

// Get the current Unix timestamp with microsecond precision
$microtime = microtime(true);  // Returns float with microseconds precision

// Format the timestamp as seconds.microseconds (e.g., 1724510801.123456)
$timestamp = sprintf('%.6f', $microtime);

$config_filename = 'configs/data_' . $timestamp . '.json';

// // // Read the incoming JSON data
$indata = json_decode(file_get_contents('php://input'), true);

if ($indata) {
    // file_put_contents('configs/log.txt', print_r($data, true));  // For debugging
    file_put_contents($config_filename, json_encode($indata, JSON_PRETTY_PRINT));
    // echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to parse data']);
}

$written_contents = file_get_contents($config_filename);


// Run the simulation program
$elf_file = './run/release/run_games';
$command = "echo \"y\" | $elf_file $config_filename";
$return_var = null;
exec($command, $return_var);

// Check the result
// if ($return_var === 0) {
//     echo "Command executed successfully.<br>";
// } else {
//     echo "Error executing the command. Return code: " . $return_var."<br>";
// }

// // create the plotly figures
$logname = "logs/data_$timestamp.csv";


$script_command = "./asset_flow_sankey.py $logname";
exec($script_command);
$sankey_filename = "figs/data_" . $timestamp . "_asset_flow_sankey.html";
chmod($sankey_filename, 0644);

$canary_command = "./plot_canary_vars.py $logname";
exec($canary_command);
$canary_filename = "figs/data_" . $timestamp . "_canary_vars.png";
chmod($canary_filename, 0644);

$choices_command = "./choices.py $logname";
exec($choices_command);
$choices_filename = "figs/data_" . $timestamp . "_choices.png";
chmod($choices_filename, 0644);

$cumulative_command = "./plot_cumulative_assets.py $logname";
exec($cumulative_command);
$cumulative_filename = "figs/data_" . $timestamp . "_cumulative_assets.png";
chmod($cumulative_filename, 0644);



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

// // Get your image and convert to base64
// $imagePath = 'figs/apple.png';
// $base64Image = base64_encode(file_get_contents($imagePath));


// $base64ImageChoices = base64_encode(file_get_contents($choices_filename));
// if (file_exists($choices_filename) {
//     $choicesImage = base64
// })



// echo json_encode($response);

$htmlContent = "<h2>This is the content inside the iframe</h2>";
$response = array(
    "sankeyhtml" => $sankeyhtml,
    "logname" => $logname,
    "script_command" => $script_command,
    "config_filename" => $config_filename,
    "sankey_filename" => $sankey_filename,
    "command" => $command,
    "written_contents" => $written_contents,
    'choices_filename' => $choices_filename,
    'canary_filename' => $canary_filename,
    'cumulative_filename' => $cumulative_filename
);
echo json_encode($response);
?> 
