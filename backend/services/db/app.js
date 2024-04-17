const express = require('express');
const bodyParser = require('body-parser');
const planRouter = require('./routes/planRouter');
const userRouter = require('./routes/userRouter');
require('dotenv').config();

// create express application
const app = express();

// middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// define routes for db endpoints
app.use('/api/db/plans', planRouter);
app.use('/api/db/users', userRouter);

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
