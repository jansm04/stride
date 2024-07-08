const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// access tokens last 1 hour
function generateAccessToken(user) {
    return jwt.sign({
        userId: user.user_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
    }, 
    SECRET_KEY,
    {
        expiresIn: '1h' 
    });
}

// refresh tokens last 7 days
function generateRefreshToken(user) {
    return jwt.sign({
        userId: user.user_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
    }, 
    REFRESH_SECRET_KEY,
    {
        expiresIn: '7d'
    });
}

// verify refresh token with callback function
function verifyRefreshToken(token, callback) {
    jwt.verify(token, REFRESH_SECRET_KEY, (error, decoded) => {
        if (error) return callback(error, null);
        callback(null, decoded);
    });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}