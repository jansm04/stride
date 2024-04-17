// insert training plan in db
function createTrainingPlan(req, res) {
    // todo
    const userInput = req.body;
    const planID = userInput.planID;
    res.status(200).json({
        result: "success",
        planID: planID
    });
}

// get training plan with id in req
function getTrainingPlan(req, res) {
    // todo
}

// delete training plan with id in req
function deleteTrainingPlan(req, res) {
    // todo
}

module.exports = {
    createTrainingPlan,
    getTrainingPlan,
    deleteTrainingPlan
};