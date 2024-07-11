const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// route to register a new user
router.post('/register', controller.register);

// route to a login a user
router.post('/login', controller.login);

// route to verify a user
router.post('/verify', controller.verify);

// route to refresh a token
router.post('/refresh-token', controller.refreshToken);

module.exports = router;