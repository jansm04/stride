const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// route to insert a training plan in the db
router.post('/:id', planController.createTrainingPlan);

// route to get a training plan from the db
router.get('/:id', planController.getTrainingPlan);

// route to delete a training plan from the db
router.delete('/:id', planController.deleteTrainingPlan);

module.exports = router;