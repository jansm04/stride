const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// route to insert a user in the db
router.post('/', userController.createUser);

// route to securely get a user's details with a username
router.post('/user-details', userController.getUserDetails);

// route to get a user from the db
router.get('/:id', userController.getUser);

// route to delete a user from the db
router.delete('/:id', userController.deleteUser);

module.exports = router;