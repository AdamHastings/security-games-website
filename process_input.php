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

unlink($logname);

?> 
