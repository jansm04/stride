const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const planRouter = require('./routes/planRouter');
const userRouter = require('./routes/userRouter');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

// create express application
const app = express();

// middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middleware to authenticate user
// const verifyUser = async (req, res, next) => {

//     const authHeader = req.headers['authorization'];
//     const accessToken = authHeader && authHeader.split(' ')[1];

//     console.log(`Verifying user... \nAccess token: ${accessToken}`);
//     try {
//         const response = await axios.post(AUTH_CONNECTION_URL, req.body, {
//             headers: {
//                 authorization: authHeader
//             } 
//         });

//         // if user is authenticated then proceed with request
//         if (response.status == 200) {
//             console.log("User authenticated!");
//             next();
//         } else {
//             console.log("User authentication failed.");
//             return res.status(response.status).json({ 
//                 error: response.error 
//             });
//         }

//         // in case of a bad axios request
//     } catch (error) {
//         const statusCode = error.response?.status;
//         return res.status(statusCode ? statusCode : 500).json({
//             error
//         });
//     }
    
// }

// authenticate user with public token
const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];    
    try {
        const decoded = jwt.verify(
            accessToken, 
            PUBLIC_KEY, 
            {
                algorithms: ['RS256']
            }
        );
        console.log("User authenticated!", decoded);
        next();
    } catch (error) {
        console.log("User authentication failed.");
        return res.status(401).json({ 
            error: error 
        });
    }
}

// use authentication middleware for all changes in the plans tables and for 
// getting/deleting users by user id in the users table 
app.use('/api/db/plans', verifyUser);
app.use('/api/db/users/protected', verifyUser);

// define routes for db endpoints
app.use('/api/db/plans', planRouter);
app.use('/api/db/users', userRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
