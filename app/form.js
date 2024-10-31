// form.js
document.getElementById('parameterForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
        "INEQUALITY": {
            "distribution": "fixed",
            "val": parseFloat(document.getElementById('inequality_val').value)
        },
        "RANSOM_B0": {
            "distribution": "fixed",
            "val": parseFloat(document.getElementById('ransom_b0_val').value)
        },
        // Add other fields similarly
        "NUM_GAMES": parseInt(document.getElementById('num_games').value)
    };

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        alert('Data saved successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving data.');
    });
});