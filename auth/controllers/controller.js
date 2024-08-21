const userService = require('../services/userService');
const tokenService = require('../services/tokenService');


// register a new user
// to register, user must enter a username and password. optionally, the user can also 
// enter a first and last name
async function register(req, res) {
    const userInput = req.body;

    // sends request to db server to insert user into the database. returns an 
    // error if the user is already registered
    userService.registerUser(userInput, async (error, user) => {
        if (error) {
            // if provided username already exists in database or some other error occurred
            // posting the user
            if (error.response) {
                return res.status(error.response.status).json(error.response.data);
            }
            // anything else
            return res.status(500).json({ 
                error: error 
            });

        // if user was successfully registered, then we try to generate and add an access + refresh token
        // pair to the response
        } else {
            // generate tokens
            const accessToken = tokenService.generateAccessToken(user);

            if (!accessToken) {
                // undo user registration
                userService.deleteUser(user.username, () => {
                    return res.status(500).json({
                        error: "Failed to generate JWT access token."
                    });
                    
                })
            }

            tokenService.generateRefreshToken(user, (error, refreshToken) => {
                
                // if an error ocurred posting the refresh token to the database
                if (error) {
                    // undo user registration
                    userService.deleteUser(user.username, () => {
                        if (error.response) {
                            return res.status(error.response.status).json(error.response.data);
                        }
                        // anything else
                        return res.status(500).json({ 
                            error: error 
                        });
                    })


                // if the refresh token was succesfully fetched then send the user 
                // info + tokens back to the client
                } else {
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
                }
            });
        }
    });
}

// login user and generate token
async function login(req, res) {
    const { username, password } = req.body;

    // sends request to database to query the users with the username provided by the client. returns 
    // an error if the username is not found or if the username is found but the password provided 
    // by the client does not match the password in the database
    userService.authenticateUser(username, password, (error, user) => {
        if (error) {
            // if database could not return a user (due to an invalid username) or some 
            // other error occurred fetching the user
            if (error.response) {
                return res.status(error.response.status).json(error.response.data);
            } 
            // if user entered an incorrect password
            if (error.message) {
                return res.status(403).json({
                    error: error.message
                })
            }
            // anything else
            return res.status(500).json({ 
                error: error 
            });
        } else {
            // generate tokens
            const accessToken = tokenService.generateAccessToken(user);
            const refreshToken = user.refresh_token;

            if (!accessToken || !refreshToken) {
                return res.status(500).json({
                    error: "Failed to generate JWT tokens."
                });
            }

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
        }
    });

}

// refresh the access token
function refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token required."
        });
    }

    // sends a request to the database to verify that the refresh token exists. returns an error
    // if the token is not found
    tokenService.verifyRefreshToken(refreshToken, (error, user) => {
        if (error) {
            // if refresh token does not exist in database or some other error occurred
            // fetching the token
            if (error.response) {
                return res.status(error.response.status).json(error.response.data);
            }
            // anything else
            return res.status(500).json({ 
                error: error 
            });

        // if valid refresh token, generate and return new token
        } else {
            const newAccessToken = tokenService.generateAccessToken(user);

            if (!newAccessToken) {
                return res.status(500).json({
                    error: "Failed to generate new JWT access token."
                });
            }

            res.status(200).json({
                accessToken: newAccessToken
            })
        }
    })
}

module.exports = {
    register,
    login,
    refreshToken,
}