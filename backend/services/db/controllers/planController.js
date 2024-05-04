const connection = require('../config');

// insert training plan in db
function createTrainingPlan(req, res) {
    const userInput = req.body;

    const userID = userInput.userID;
    const planID = userInput.planID;

    const weeks = userInput.weeks;
    const targetTime = userInput.targetTime;
    const createdAt = userInput.createdAt;

    try {
        if (!planID) return res.status(500).json({ error: "Missing plan ID." });

        const factQuery = 'INSERT INTO stride.fact ( user_id, plan_id ) VALUES (?, ?);'
        const planDetailsQuery = 'INSERT INTO stride.plan_details ( plan_id, weeks, target_time, created_at ) VALUES (?, ?, ?, ?);';
        const factValues = [userID, planID];
        const planDetailsValues = [planID, weeks, targetTime, createdAt];

        connection.query(factQuery, factValues, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("Plan inserted successfully into fact table.", results);
        })
        connection.query(planDetailsQuery, planDetailsValues, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("Plan inserted successfully into plan details table.", results);
        })

        res.status(500).json({ result: "Plan added successfully." });
    } catch (error) {
        res.status(500).json({ error: error });
    }
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