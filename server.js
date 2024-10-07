const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 80; // Set the port to 80

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Path to predictions.txt
const predictionsFilePath = path.join(__dirname, 'predictions.txt');

// Function to read predictions from predictions.txt
const readPredictions = () => {
    const data = fs.readFileSync(predictionsFilePath, 'utf8');
    return data.split('\n').filter(line => line.trim() !== ''); // Return non-empty lines
};

// Endpoint to receive names
app.post('/submit-name', (req, res) => {
    const userName = req.body.name;
    let responseMessage = '';

    // Check for specific username
    if (userName.toLowerCase() === 'anuj') {
        responseMessage = "You are God; you build others' future.";
    } else {
        // Get random prediction
        const predictions = readPredictions();
        const randomIndex = Math.floor(Math.random() * predictions.length);
        responseMessage = predictions[randomIndex]; // Get a random prediction
    }

    // Send a response
    res.json({ message: responseMessage });
});

// Start the server on port 80
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
