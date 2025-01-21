// Listen for the form submission event
document.getElementById('predictionForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page
    
    // Get the value of the name entered by the user
    const name = document.getElementById('name').value;
    
    // Validate the name length (between 4 and 20 characters)
    if (name.length < 4 || name.length > 20) {
        document.getElementById('responseMessage').textContent = "Name must be between 4 and 20 characters.";
        return;
    }

    // Check if the name contains only letters and spaces
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(name)) {
        document.getElementById('responseMessage').textContent = "Name can only contain letters and spaces.";
        return;
    }

    // Send the entered name to the backend using fetch
    fetch('/submit-name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })  // Convert name to JSON format
    })
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        // Update the response message with the prediction received from the server
        document.getElementById('responseMessage').textContent = data.message;
    })
    .catch(error => {
        console.error('Error:', error);  // Log any errors
        document.getElementById('responseMessage').textContent = "Something went wrong!";  // Display error message
    });
});
