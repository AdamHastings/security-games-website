<?php
// Define the path where the generated HTML will be saved
$output_file = 'generated_file.html';

// Generate new HTML content
$html_content = "
<html>
    <head><title>Generated Page</title></head>
    <body>
        <h1>Hello, this is a dynamically generated HTML file!</h1>
    </body>
</html>";

// Save the generated HTML content to a file
file_put_contents($output_file, $html_content);

chmod($output_file, 0644);


// Optionally, redirect to the generated HTML (depending on your setup)
header("Location: $output_file");
?>