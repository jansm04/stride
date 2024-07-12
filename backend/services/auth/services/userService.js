const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;

// register new user and post user data to external server
async function registerUser(userInput, callback) {
    console.log("Registering user...");
    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    
    // send a request to external server to post new user
    axios.post(DB_CONNECTION_URL, {
        username: userInput.username,
        password: hashedPassword,
        firstName: userInput.firstName,
        lastName: userInput.lastName
    }, {
        // throw an error if the response status is anything other than 200
        validateStatus: (status) => {
            return status == 200; 
        }
    }).then((response) => {
        console.log("User registered!");
        callback(null, response.data);
        
    }).catch((error) => {
        console.log("User registration failed.");
        callback(error, null);
    });
}

// authenticate user
function authenticateUser(username, password, callback) {
    console.log("Checking user credentials...");

    // send a request to the external server to get user details
    axios.post(DB_CONNECTION_URL + "/user-details", {
        username: username
    }, {
        // throw an error if the response status is anything other than 200
        validateStatus: (status) => {
            return status == 200; 
        }
    }).then(async (response) => {
        const user = response.data;

        // verify password proviced by user is the same as the password attached to the 
        // username found in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            console.log("Username and password is correct.");
            callback(null, user);
        } else {
            const message = "Authentication failed: Invalid password."
            console.log(message);
            callback(new Error(message), null);
        }

    }).catch((error) => {
        console.log("Authentication failed: An error occurred sending the data to the database server.");
        callback(error, null);
    });
}

module.exports = {
    registerUser,
    authenticateUser
}