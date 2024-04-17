// insert training plan in db
function createTrainingPlan(req, res) {
    // todo
    const userInput = req.body;
    const userID = userInput.userID;
    console.log(`Adding user with ID: ${userID}`);

    res.status(200).json({
        result: "success"
    })
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