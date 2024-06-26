const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the RDS MySQL database!');
});

module.exports = connection;
