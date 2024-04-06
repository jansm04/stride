const generator = require('../logic/generator');

// controller function to handle the request for generating a training plan
function generateTrainingPlan(req, res) {
    try {
        const userInput = req.body;
        const trainingPlan = generator.generateTrainingPlan(userInput);
        res.status(200).json(trainingPlan);

    } catch (error) {
        console.error('Error generating training plan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    generateTrainingPlan,
};