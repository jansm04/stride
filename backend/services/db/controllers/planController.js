const connection = require('../config');

// insert training plan in db
async function createTrainingPlan(req, res) {
    const userInput = req.body;

    const userID = userInput.userID;
    const planID = userInput.planID;

    const weeks = userInput.weeks;
    const targetTime = userInput.targetTime;
    const createdAt = userInput.createdAt;
    const trainingPlan = userInput.trainingPlan;

    try {
        if (!planID) return res.status(500).json({ error: "Missing plan ID." });

        const factQuery = 'INSERT INTO stride.fact ( user_id, plan_id ) VALUES (?, ?);'
        const planDetailsQuery = 'INSERT INTO stride.plan_details ( plan_id, weeks, target_time, created_at ) VALUES (?, ?, ?, ?);';
        const factValues = [userID, planID];
        const planDetailsValues = [planID, weeks, targetTime, createdAt];
        
        await connection.query(factQuery, factValues, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                res.status(500).json({ error: error.sqlMessage });
            }
            console.log("Plan inserted successfully into fact table.", results);
        })
        await connection.query(planDetailsQuery, planDetailsValues, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                res.status(500).json({ error: error.sqlMessage });
            }
            console.log("Plan inserted successfully into plan details table.", results);
        })
        const planWorkoutsQuery = 'INSERT INTO stride.plan_workouts ( plan_id, week, day, distance, description ) VALUES (?, ?, ?, ?, ?);';
        const items = Array.from(trainingPlan);
        for (let i = 0; i < items.length; i++) {
            const week = items[i].week;
            const workouts = Array.from(items[i].workouts);
            for (let j = 0; j < workouts.length; j++) {
                const planWorkoutsValues = [planID, week, workouts[j].day, workouts[j].workout.distance, workouts[j].workout.description];
                await connection.query(planWorkoutsQuery, planWorkoutsValues, (error, results) => {
                    if (error) {
                        console.log(error.sqlMessage);
                        res.status(500).json({ error: error.sqlMessage });
                    }
                })
            }
        }
        res.status(200).json({ result: "Plan inserted successfully. "});
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

        const planDetailsQuery = 'DELETE FROM stride.plan_details WHERE plan_id = ?;';
        const planWorkoutsQuery = 'DELETE FROM stride.plan_workouts WHERE plan_id = ?;';
        const factQuery = 'DELETE FROM stride.fact WHERE plan_id = ?;';
        const values = [planID];

        connection.query(planDetailsQuery, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("Plan deleted successfully from plan details table.", results);
        })
        connection.query(planWorkoutsQuery, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("Plan deleted successfully from plan workouts table.", results);
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