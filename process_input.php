<?php

// Get the current Unix timestamp with microsecond precision
$microtime = microtime(true);  // Returns float with microseconds precision

// Format the timestamp as seconds.microseconds (e.g., 1724510801.123456)
$timestamp = sprintf('%.6f', $microtime);

// The ELF file or command you want to run
$elf_file = 'run/release/run_games';
$config = 'configs/server_config.json'; // replace later with custom config scraped from html form
$logname = "logs/$timestamp.csv";

$command = "$elf_file $config $logname";

exec($command);

// create the plotly figures
$script_command = "./asset_flow_sankey.py $logname";
exec($script_command);
$sankey_filename = "figs/" . $timestamp . "_asset_flow_sankey.html";
// chmod($sankey_filename, 0644);

$sankey_filename = "figs/server_config_asset_flow_sankey.html";

echo $timestamp."<br>\n";
echo $command."<br>\n";
echo $sankey_filename."<br>\n";

// Check if the file exists
if (file_exists($sankey_filename)) {
    // Read and return the contents of the HTML file
    echo file_get_contents($sankey_filename);
} else {
    // Handle the case where the file doesn't exist
    echo "<h1>Error: The requested HTML file does not exist.</h1>";
}

unlink($logname);
unlink($sankey_filename);

?> 
