document.getElementById('predictionForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page
    
    const name = document.getElementById('name').value;
    
    // Validate the name
    if (name.length < 4 || name.length > 20) {
        document.getElementById('responseMessage').textContent = "Name must be between 4 and 20 characters.";
        return;
    }

    // Check if name contains only letters and spaces
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(name)) {
        document.getElementById('responseMessage').textContent = "Name can only contain letters and spaces.";
        return;
    }

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
