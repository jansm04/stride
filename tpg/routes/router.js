const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')

// route to generate a training plan based on user input
router.post('/', controller.generateTrainingPlan);

module.exports = router;