const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();  // To load credentials from .env
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Set up MySQL connection using .env credentials
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kinggod'
});

// In-memory storage for predictions
const predictionCache = {};

// Function to get random prediction from the database
const getRandomPrediction = (callback) => {
    const query = 'SELECT prediction FROM predictions ORDER BY RAND() LIMIT 1';
    db.query(query, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results[0].prediction); // Return the random prediction
    });
};

// Function to check if prediction for the user is valid for 24 hours
const getValidPrediction = (userName, callback) => {
    const currentTime = Date.now();

    if (predictionCache[userName]) {
        const { prediction, timestamp } = predictionCache[userName];
        const timeDiff = currentTime - timestamp;

        // If prediction is less than 24 hours old, return it
        if (timeDiff < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
            return callback(null, prediction);
        }
    }

    // If no valid prediction, fetch a new one
    getRandomPrediction((err, prediction) => {
        if (err) {
            callback(err, null);
            return;
        }

        // Store the new prediction and timestamp
        predictionCache[userName] = {
            prediction,
            timestamp: currentTime
        };
        callback(null, prediction);
    });
};

// Endpoint to receive names
app.post('/submit-name', (req, res) => {
    const userName = req.body.name;
    let responseMessage = '';

    // Check for specific username
    if (userName.toLowerCase() === 'anuj') {
        responseMessage = "You are God; you build others' future.";
        return res.json({ message: responseMessage });
    }

    // Check for valid prediction or generate a new one
    getValidPrediction(userName, (err, prediction) => {
        if (err) {
            responseMessage = "Error fetching prediction.";
        } else {
            responseMessage = prediction;
        }
        res.json({ message: responseMessage });
    });
});

// Start the server on port 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
