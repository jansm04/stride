const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const cors = require('cors');
require('dotenv').config();

// create express application
const app = express();

app.use(cors());

// middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/tpg/connect', (req, res) => {
    return res.status(200).json({ result: "success" });
})

// define routes for training plan endpoints
app.use('/api/tpg', router);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
