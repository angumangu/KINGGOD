const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 80; // Set the port to 80

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Path to data.json
const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from data.json
const readData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Function to write data to data.json
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Endpoint to receive names
app.post('/submit-name', (req, res) => {
    const userName = req.body.name;
    let responseMessage = '';

    // Determine the user's origin based on their name (this logic can be adapted)
    if (isHinduName(userName)) {
        responseMessage = "Bholenath is your God";
    } else if (isMuslimName(userName)) {
        responseMessage = "Allah is your God";
    } else if (isChristianName(userName)) {
        responseMessage = "Jesus is your God";
    } else {
        responseMessage = "You are a pig";  // Default response
    }

    // Read existing data
    const data = readData();

    // Save the new user to the data
    data.users.push({ name: userName, origin: responseMessage });

    // Write updated data back to data.json
    writeData(data);

    // Send a response
    res.json({ message: responseMessage });
});

// Example functions to categorize names
const isHinduName = (name) => {
    // Example logic; replace with your actual name-checking logic
    const hinduNames = ['rajesh', 'sita', 'krishna'];
    return hinduNames.includes(name.toLowerCase());
};

const isMuslimName = (name) => {
    const muslimNames = ['ahmed', 'fatima', 'ali'];
    return muslimNames.includes(name.toLowerCase());
};

const isChristianName = (name) => {
    const christianNames = ['john', 'mary', 'peter'];
    return christianNames.includes(name.toLowerCase());
};

// Start the server on port 80
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
