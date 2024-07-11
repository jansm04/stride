const userService = require('../services/userService');
const tokenService = require('../services/tokenService');


// register a new user
// to register, user must enter a username and password. optionally, the user can also 
// enter a first and last name
async function register(req, res) {
    const userInput = req.body;
    try {
        const user = await userService.registerUser(userInput);

        // generate tokens
        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = await tokenService.generateRefreshToken(user);
        res.status(200).json({ 
            result: "success",
            user: {
                userId: user.user_id,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name
            },
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
        const refreshToken = user.refresh_token;
        res.status(200).json({ 
            result: "success",
            user: {
                userId: user.user_id,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// verify the user
function verify(req, res) {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
        console.log("Access token required.");
        return res.status(401).json({
            message: "Access token required."
        });
    }

    // authenticate token
    tokenService.verifyAccessToken(accessToken, (error, user) => {
        if (error) {
            console.log("Verification failed.");
            return res.status(403).json({
                error: error
            })
        }
        console.log("User successfully authenticated!");
        res.status(200).json({ 
            result: "success",
            user: user 
        });
    })
}

// refresh the access token
function refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token required."
        });
    }

    tokenService.verifyRefreshToken(refreshToken, (error, user) => {
        if (error) {
            return res.status(403).json({
                message: "Invalid refresh token."
            });
        }
        // if valid refresh token, generate and return new token
        const newAccessToken = tokenService.generateAccessToken(user);
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
    verify
    // authenticateToken
}