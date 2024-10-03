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

    // Check for specific username
    if (userName.toLowerCase() === 'anuj') {
        responseMessage = "You are God; you build others' future.";
    } else {
        // Get the first letter of the username
        const firstLetter = userName.charAt(0).toUpperCase();

        // Generate a message based on the first letter
        responseMessage = getMessageByFirstLetter(firstLetter);
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

// Function to get messages based on the first letter
const getMessageByFirstLetter = (letter) => {
    const messages = {
        A: "You’ll find a chance to grow—right after you step on a rake. Ouch!",
        B: "A new friendship will bring joy... and possibly an awkward trip to the ER.",
        C: "An exciting adventure is coming! Just don’t forget your emergency kit.",
        D: "You’ll discover a hidden talent: making the perfect excuse to avoid family dinners.",
        E: "A change in your life will inspire you—right after you misplace your keys... again.",
        F: "You will meet someone important. They might be a ghost, but hey, it’s company!",
        G: "You’ll get a chance to show off your skills at work, preferably before the coffee wears off.",
        H: "A journey will bring new insights... mostly about how to avoid traffic.",
        I: "A creative project will inspire you—unless the power goes out first.",
        J: "An important decision is ahead. Choose wisely, or it could lead to a lifetime of cat videos.",
        K: "A leadership chance will challenge you—like herding cats, but with more paperwork.",
        L: "A dream you’ve had is getting closer... right before it turns into a nightmare.",
        M: "An old friend will reach out—probably because they need a bail bond.",
        N: "A surprise money boost is coming! Just don’t spend it all on snacks... or do!",
        O: "You’ll face a challenge but come out stronger—like a zombie after a bad haircut.",
        P: "You will get recognition for your hard work... right before someone else steals your idea.",
        Q: "A new learning opportunity will help you grow, or at least help you laugh at your mistakes.",
        R: "A sudden chance will lead to excitement! Just watch out for the “No Refunds” sign.",
        S: "Take time to reflect on your goals... preferably while hiding under the covers.",
        T: "A new hobby will bring you joy—until it becomes an obsession you regret.",
        U: "You’ll help others with your knowledge—after they promise not to eat your lunch again.",
        V: "A new perspective will open doors for you, but those doors might lead to a spooky basement.",
        W: "A rewarding chance will come from something you love—like napping during meetings.",
        X: "You’ll be inspired by a book or mentor... probably one that advises on how to escape awkward situations.",
        Y: "A relationship will grow deeper, possibly involving a shared fear of clowns.",
        Z: "An invitation will lead to a fun event—just remember to bring your own snacks and a flashlight!"
    };

    return messages[letter] || "You entered an unrecognized name!";
};

// Example functions to categorize names
const isHinduName = (name) => {
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
