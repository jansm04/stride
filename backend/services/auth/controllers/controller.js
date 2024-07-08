const userService = require('../services/userService');
const tokenService = require('../services/tokenService');


// register a new user
// to register, user must enter a username and password. optionally, the user can also 
// enter a first and last name
async function register(req, res) {
    const userInput = req.body;
    console.log(userInput);
    try {
        const user = await userService.registerUser(userInput);

        // generate tokens
        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);
        res.status(200).json({ 
            result: "registration successful",
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// login user and generate token
async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await userService.authenticateUser(username, password);

        // generate tokens
        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);
        res.status(200).json({ 
            result: "login successful",
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// refresh the access token
function refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(500).json({
            message: "Refresh token required."
        });
    }

    tokenService.verifyRefreshToken(refreshToken, (error, user) => {
        if (error) {
            return res.status(500).json({
                message: "Invalid refresh token."
            });
        }

        // if valid refresh token, generate and return new token
        const newAccessToken = token.generateAccessToken(user);
        res.status(200).json({
            accessToken: newAccessToken
        })
    })
}

// // middleware to authenticate token
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(500).json({
//             message: "Access token required."
//         });
//     }

//     // authenticate token
//     tokenService.verifyAccessToken(token, (error, user) => {
//         if (error) {
//             return res.status(500).json({
//                 message: "Invalid access token."
//             });
//         }
//         req.user = user;
//         next();
//     })
// }

module.exports = {
    register,
    login,
    refreshToken,
    // authenticateToken
}