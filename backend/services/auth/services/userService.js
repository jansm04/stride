const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;

// register new user and post user data to external server
async function registerUser(userInput) {
    console.log("Registering user...");
    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    try {
        // send a request to external server to post new user
        const response = await axios.post(DB_CONNECTION_URL, {
            username: userInput.username,
            password: hashedPassword,
            firstName: userInput.firstName,
            lastName: userInput.lastName
        })

        if (response.status !== 200) {
            throw new Error("Registration failed: Unable to reach external server.");
        }

        const user = response.data;

        // make sure the user exists
        if (!user) {
            throw new Error("Registration failed: User not found");
        }
        console.log("User registered!");
        return user;

    } catch (error) {
        console.log("An error occurred registering the user:", error);
        throw error;
    }
}

// authenticate user
async function authenticateUser(username, password) {
    console.log("Checking user credentials...");
    try {
        // send a request to the external server to get user details
        const response = await axios.post(DB_CONNECTION_URL + "/user-details", {
            username: username
        })

        if (response.status !== 200) {
            throw new Error("Authentication failed: Unable to reach external server.");
        }

        const user = response.data;

        // make sure the user exists
        if (!user) {
            throw new Error("Authentication failed: User not found.");
        }

        // verify password proviced by user is the same as the password attached to the 
        // username found in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Authentication failed: Invalid password.");
        }
        console.log("Username and password is correct.");
        return user;

    } catch (error) {
        console.log("An error occurred authenticating the user:", error);
        throw error;
    }
}

module.exports = {
    registerUser,
    authenticateUser
}