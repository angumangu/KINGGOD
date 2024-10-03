// server.js
const express = require('express');
const app = express();
const port = 80; // Set the port to 80

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to receive names
app.post('/submit-name', (req, res) => {
    const name = req.body.name;
    console.log(`Received name: ${name}`);
    res.json({ message: `Hello, ${name}!` });
});

// Start the server on port 80
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
