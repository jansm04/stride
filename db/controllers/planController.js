const connection = require('../config');

/*
insert plan into db

NOTE: plan_id is auto incremented on insertion to the fact table so we do not need to add to the query.
once the query is sent we can then retrieve the plan_id as the insert id of the results and use it to make
insertions for the plan_details and plan_workouts table

    Example of an insertion:
    ------------------------------------------------------------------

    fact:
    +---------+---------+
    | user_id | plan_id |
    +---------+---------+
    |       1 |       4 |
    +---------+---------+

    plan_details:
    +---------+-------+-------------+---------------------+
    | plan_id | weeks | target_time | created_at          |
    +---------+-------+-------------+---------------------+
    |       4 |    16 |         220 | 17:18:12 2024-05-02 |
    +---------+-------+-------------+---------------------+

    plan_workouts:
    +------------+---------+------+-----------+----------+-------------+
    | workout_id | plan_id | week | day       | distance | description |
    +------------+---------+------+-----------+----------+-------------+
    |        241 |       4 |    1 | monday    |        4 | easy        |
    |        242 |       4 |    1 | tuesday   |        5 | easy        |
    |        243 |       4 |    1 | wednesday |        4 | tempo       |
    |        244 |       4 |    1 | friday    |        4 | easy        |
    (for all the workouts)

*/
async function createTrainingPlan(req, res) {
    const userId = req.params.id;
    const userInput = req.body;

    const weeks = userInput.weeks;
    const targetTime = userInput.targetTime;
    const createdAt = userInput.createdAt;
    const trainingPlan = userInput.trainingPlan;

    try {
        const missingInfoMessage = "Missing required information."
        if (!userId || !weeks || !targetTime || !createdAt || !trainingPlan) 
            return res.status(500).json({ error: missingInfoMessage });

        // insert plan into central fact table
        const factQuery = 'INSERT INTO stride.fact ( user_id ) VALUES (?);'
        const factValues = [
            userId
        ];
        connection.query(factQuery, factValues, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            const planID = results.insertId;
            console.log("Plan inserted successfully into fact table.", results);
            
            // insert plan to plan_details table
            const planDetailsQuery = 'INSERT INTO stride.plan_details ( plan_id, weeks, target_time, created_at ) VALUES (?, ?, ?, ?);';
            const planDetailsFact = [
                planID,
                weeks,
                targetTime,
                createdAt
            ];
            connection.query(planDetailsQuery, planDetailsFact, (error, results) => {
                if (error) {
                    console.log(error.sqlMessage);
                    return res.status(500).json({ error: error.sqlMessage });
                }
                console.log("Plan inserted successfully into plan_details table.", results);
            })

            // insert plan to plan_workouts table
            const planWorkoutsQuery = 'INSERT INTO stride.plan_workouts ( plan_id, week, day, distance, description ) VALUES (?, ?, ?, ?, ?);';
            const items = Array.from(trainingPlan);

            if (!items) 
                return res.status(500).json({ error: "Field 'trainingPlan' should be an array of objects." });

            for (let i = 0; i < items.length; i++) {

                // each item consists of a week # and an array of workouts for that week
                const item = items[i];

                const week = item.week;
                const workouts = Array.from(item.workouts);
                if (!week || !workouts)
                    return res.status(500).json({ error: missingInfoMessage });

                // insert a row for each workout in the week
                for (let j = 0; j < workouts.length; j++) {
                    const workout = workouts[j];
                    const day = workout.day;
                    const details = workout.workout;
                    if (!day || !details)
                        return res.status(500).json({ error: missingInfoMessage });

                    const distance = details.distance;
                    const description = details.description;
                    if (!distance || !description)
                        return res.status(500).json({ error: missingInfoMessage });

                    const planWorkoutsValues = [
                        planID, 
                        week, 
                        day, 
                        distance, 
                        description
                    ];
                    connection.query(planWorkoutsQuery, planWorkoutsValues, (error, results) => {
                        if (error) {
                            console.log(error.sqlMessage);
                            return res.status(500).json({ error: error.sqlMessage });
                        }

                        // send response once last row is added
                        if (i == items.length - 1 && j == workouts.length - 1) {
                            console.log(`Successfully added plan to plan_workouts table. Affected rows: ${items.length * workouts.length}`);
                            res.status(200).json({ result: "success" });
                        }
                    })
                }
            }
        })
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

// get training plan with user id in req
async function getTrainingPlan(req, res) {
    const userId = req.params.id;
    try {
        if (!userId) 
            return res.status(500).json({ error: "Missing user ID." });

        // fetch plan id from given user then get all records under that id
        const factSelectQuery = 'SELECT plan_id FROM stride.fact WHERE user_id = ?;'
        const factSelectValues = [userId];
        connection.query(factSelectQuery, factSelectValues, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            if (results.length == 0) {
                const message = "Empty result set fetched";
                console.log(message);
                return res.status(500).json({ error: message });
            }
            const planID = results[0].plan_id;
            const values = [planID];

            // get plan from plan_details table
            const planDetailsQuery = 'SELECT * FROM stride.plan_details WHERE plan_id = ?;';
            connection.query(planDetailsQuery, values, (error, results) => {
                if (error) {
                    console.log(error.sqlMessage);
                    return res.status(500).json({ error: error.sqlMessage });
                }
                const planDetails = results[0];
                console.log("Successfully fetched plan from plan_details table.");

                const weeks = planDetails.weeks;
                const targetTime = planDetails.target_time;
                const createdAt = planDetails.created_at;

                /*
                get plan from plan workouts table
                    
                this is done by first querying a list of all the weeks included in the training 
                plan. this list is then used to submit more queries to get the workouts from each week
                */
                const planWorkoutsGroupByQuery = 'SELECT week FROM stride.plan_workouts WHERE plan_id = ? GROUP BY week;';
                connection.query(planWorkoutsGroupByQuery, values, (error, weekResults) => {
                    if (error) {
                        console.log(error.sqlMessage);
                        return res.status(500).json({ error: error.sqlMessage });
                    }

                    // query used to get workouts from each week
                    const planWorkoutsWeeklyQuery = 'SELECT * FROM stride.plan_workouts WHERE plan_id = ? AND week = ?;';

                    var trainingPlan = new Array();
                    for (let i = 0; i < weekResults.length; i++) {
                        const week = weekResults[i].week;
                        const planWorkoutsWeeklyValues = [
                            planID,
                            week
                        ]
                        connection.query(planWorkoutsWeeklyQuery, planWorkoutsWeeklyValues, (error, rowResults) => {
                            if (error) {
                                console.log(error.sqlMessage);
                                return res.status(500).json({ error: error.sqlMessage });
                            }

                            var workouts = new Array();
                            for (let j = 0; j < rowResults.length; j++) {
                                const row = rowResults[j];

                                const day = row.day;
                                const distance = row.distance;
                                const description = row.description;

                                workouts.push({
                                    day: day,
                                    workout: {
                                        distance: distance,
                                        description: description
                                    }
                                })
                            }
                            trainingPlan.push({
                                week: week,
                                workouts: workouts
                            })

                            // if iterating through last week
                            if (i == weekResults.length - 1) {
                                res.status(200).json({
                                    createdAt: createdAt,
                                    weeks: weeks,
                                    targetTime: targetTime,
                                    trainingPlan: trainingPlan
                                });
                            }
                        })
                    }
                });
            })
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// delete training plan with user id in req
async function deleteTrainingPlan(req, res) {
    const userId = req.params.id;
    try {
        if (!userId) 
            return res.status(500).json({ error: "Missing plan ID." });

        // fetch plan id from given user then delete all records under that id
        const factSelectQuery = 'SELECT plan_id FROM stride.fact WHERE user_id = ?;'
        const factSelectValues = [userId];
        connection.query(factSelectQuery, factSelectValues, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            const planID = results[0].plan_id;
            const values = [planID];

            // delete plan from plan_details table
            const planDetailsQuery = 'DELETE FROM stride.plan_details WHERE plan_id = ?;';
            connection.query(planDetailsQuery, values, (error, results) => {
                if (error) {
                    console.log(error.sqlMessage);
                    return res.status(500).json({ error: error.sqlMessage });
                }
                console.log("Succesfully deleted plan from plan_details table.", results);
            })

            // delete plan from plan_workouts table
            const planWorkoutsQuery = 'DELETE FROM stride.plan_workouts WHERE plan_id = ?;';
            connection.query(planWorkoutsQuery, values, (error, results) => {
                if (error) {
                    console.log(error.sqlMessage);
                    return res.status(500).json({ error: error.sqlMessage });
                }
                console.log("Succesfully deleted plan from plan_workouts table.", results);
            })

            // delete plan from fact table
            const factQuery = 'DELETE FROM stride.fact WHERE plan_id = ?;';
            connection.query(factQuery, values, (error, results) => {
                if (error) {
                    console.log(error.sqlMessage);
                    return res.status(500).json({ error: error.sqlMessage });
                }
                console.log("Succesfully deleted plan from fact table.", results);
                res.status(200).json({ result: "success" });
            })
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
