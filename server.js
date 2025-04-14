const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();  // To load credentials from .env
const client = require('prom-client'); // Prometheus client

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// ------------------- Prometheus Metrics Setup -------------------

// Create a Registry to register metrics
const register = new client.Registry();

// Collect default system metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metric: HTTP request counter
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

// Middleware to increment request count
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.labels(req.method, req.path, res.statusCode.toString()).inc();
    });
    next();
});

// Endpoint for Prometheus to scrape metrics
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// ---------------------------------------------------------------

// In-memory storage for predictions
const predictionCache = {};

// Function to read the contents of predictions.txt and return a random prediction
const getRandomPrediction = (callback) => {
    fs.readFile('predictions.txt', 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }

        const predictions = data.split('\n').filter(line => line.trim() !== '');
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        callback(null, randomPrediction);
    });
};

// Function to check if prediction for the user is valid for 24 hours
const getValidPrediction = (userName, callback) => {
    const currentTime = Date.now();

    if (predictionCache[userName]) {
        const { prediction, timestamp } = predictionCache[userName];
        const timeDiff = currentTime - timestamp;

        if (timeDiff < 24 * 60 * 60 * 1000) {
            return callback(null, prediction);
        }
    }

    getRandomPrediction((err, prediction) => {
        if (err) {
            callback(err, null);
            return;
        }

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

    if (userName.toLowerCase() === 'anuj') {
        responseMessage = "You are God; you build others' future.";
        return res.json({ message: responseMessage });
    }

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

