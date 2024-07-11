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
        res.status(500).json({error});
    }
}

async function generateRefreshToken(user) {
    console.log("Generating refresh token...");
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const response = await axios.post(DB_CONNECTION_URL + '/insert-refresh', {
        userId: user.user_id,
        refreshToken: refreshToken
    });
    if (response.status !== 200) {
        res.status(response.status).json({
            error: "Refresh failed: Unable to reach external server."
        });
    }
    console.log("Refresh token generated!");
    return refreshToken;
}

// verify refresh token by querying the database
async function verifyRefreshToken(refreshToken, callback) {
    const response = await axios.post(DB_CONNECTION_URL + '/verify-refresh', {
        refreshToken: refreshToken
    });
    if (response.status !== 200) {
        callback(new Error(), null);
    }
    console.log("RESPONSE BODY:", response.data);
    callback(null, response.data);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    // verifyAccessToken,
    verifyRefreshToken
}