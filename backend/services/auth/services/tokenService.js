const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');

const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// access tokens last 1 hour
function generateAccessToken(user) {
    console.log("Generating access token...");
    try {
        const accessToken = jwt.sign({
            userId: user.user_id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name
        }, 
        PRIVATE_KEY,
        {
            expiresIn: '1h',
            algorithm: 'RS256'
        });
        console.log("Access token generated!");
        return accessToken;
    } catch (error) {
        console.log(error);
    }
}

// generate refresh token as random 64 byte string
function generateRefreshToken(user, callback) {
    console.log("Generating refresh token...");

    const refreshToken = crypto.randomBytes(64).toString('hex');
    axios.post(DB_CONNECTION_URL + '/insert-refresh', {
        userId: user.user_id,
        refreshToken: refreshToken
    }, {
        // throw an error if the response status is anything other than 200
        validateStatus: (status) => {
            return status == 200; 
        }
    }).then(() => {
        console.log("Refresh token generated!");
        callback(null, refreshToken)

    }).catch((error) => {
        console.log("Failed to generate refresh token.", error);
        callback(error, null);
    });
}

// verify refresh token by querying the database
function verifyRefreshToken(refreshToken, callback) {
    console.log("Verifying refresh token...");
    axios.post(DB_CONNECTION_URL + '/verify-refresh', {
        refreshToken: refreshToken
    }, {
        // throw an error if the response status is anything other than 200
        validateStatus: (status) => {
            return status == 200; 
        }
    }).then((response) => {
        console.log("Refresh token verified!", response.data);
        callback(null, response.data);

    }).catch((error) => {
        console.log("Failed to verify refresh token.");
        callback(error, null);
    });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}