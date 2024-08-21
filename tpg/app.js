const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');
require('dotenv').config();

// create express application
const app = express();

// middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/tpg/connect', (req, res) => {
    return res.status(200).json({ result: "success" });
})

// define routes for training plan endpoints
app.use('/api/tpg', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
