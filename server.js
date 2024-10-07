const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 80;

// Middleware to parse JSON
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Path to data.json (for storing users and their predictions)
const dataFilePath = path.join(__dirname, 'data.json');

// Path to predictions.txt (where predictions are stored)
const predictionsFilePath = path.join(__dirname, 'predictions.txt');

// Function to read data from data.json
const readData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Function to write data to data.json
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Function to read predictions from predictions.txt
const readPredictions = () => {
    const predictionsData = fs.readFileSync(predictionsFilePath, 'utf-8');
    return predictionsData.split('\n').filter(prediction => prediction.trim() !== '');
};

// Function to get a random prediction
const getRandomPrediction = (predictions) => {
    const randomIndex = Math.floor(Math.random() * predictions.length);
    return predictions[randomIndex];
};

// API Endpoint to receive names and return a random prediction
app.post('/submit-name', (req, res) => {
    const userName = req.body.name;

    // Read predictions from the file
    const predictions = readPredictions();

    // Get a random prediction
    const randomPrediction = getRandomPrediction(predictions);

    // Read existing data
    const data = readData();

    // Save the new user and prediction
    data.users.push({ name: userName, prediction: randomPrediction });
    writeData(data);

    // Send the random prediction as response
    res.json({ message: randomPrediction });
});

// Start server on port 80
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
