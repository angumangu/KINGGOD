document.getElementById('predictionForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page
    
    const name = document.getElementById('name').value;
    
    // Send the entered name to the backend
    fetch('/submit-name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    })
    .then(response => response.json())
    .then(data => {
        // Display the random prediction
        document.getElementById('responseMessage').textContent = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseMessage').textContent = "Something went wrong!";
    });
});
