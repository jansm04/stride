const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

// middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/auth/connect', (req, res) => {
  return res.status(200).json({ result: "success" });
})

// define routes
app.use('/api/auth', router);

// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});