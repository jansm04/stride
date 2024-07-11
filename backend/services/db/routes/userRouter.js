const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// route to insert a user in the db
router.post('/', userController.createUser);

// route to securely get a user's details with a username
router.post('/user-details', userController.getUserDetails);

// route to insert a user's refresh token into the db
router.post('/insert-refresh', userController.insertRefreshToken);

// route to verify a user's refresh token
router.post('/verify-refresh', userController.verifyRefreshToken);

/*
NOTE:
the below routes are protected, meaning they require user authentication to 
access, unlike the routes above. this is designed because the routes above 
are ONLY called by the authentication server (to register and login users) 
and are used to generate the jwt tokens for future requests. the routes below 
may called by the client
*/

// route to get a user from the db
router.get('/protected/:id', userController.getUser);

// route to delete a user from the db
router.delete('/protected/:id', userController.deleteUser);

module.exports = router;