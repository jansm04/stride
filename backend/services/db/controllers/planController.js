const connection = require('../config');

// insert training plan in db
function createTrainingPlan(req, res) {
    // todo
}

// get training plan with id in req
function getTrainingPlan(req, res) {
    const planID = req.params.id;
    try {
        if (!planID) return res.status(500).json({ error: "Missing plan ID." });

        const query = 'SELECT * FROM stride.plans WHERE plan_id = ?;';
        const values = [planId];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            const data = results[0];
            console.log("Plan fetched successfully.", data);
            res.status(200).json(data);
        })
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// delete training plan with id in req
function deleteTrainingPlan(req, res) {
    const planID = req.params.id;
    try {
        if (!planID) return res.status(500).json({ error: "Missing plan ID." });

        const plansQuery = 'DELETE FROM stride.plans WHERE plan_id = ?';
        const factQuery = 'DELETE FROM stride.fact WHERE plan_id = ?';
        const values = [planID];

        connection.query(plansQuery, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("Plan deleted successfully from plans table.", results);
        })
        connection.query(factQuery, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("Plan deleted successfully from fact table.", results);
            res.status(200).json({ result: "Plan deleted successfully." });
        })
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

module.exports = {
    createTrainingPlan,
    getTrainingPlan,
    deleteTrainingPlan
};