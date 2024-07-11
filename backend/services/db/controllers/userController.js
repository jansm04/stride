const connection = require('../config');

// insert user into db
function createUser(req, res) {
    const userInput = req.body;

    const username = userInput.username;
    const password = userInput.password;

    // optional variables
    const firstName = userInput.firstName ? userInput.firstName : null;
    const lastName = userInput.lastName ? userInput.lastName : null;

    try {
        if (!username || !password)
            return res.status(500).json({ error: "Missing required variables" });

        const insertQuery = 'INSERT INTO stride.users ( username, password, first_name, last_name) VALUES (?, ?, ?, ?);'
        const insertValues = [username, password, firstName, lastName];

        connection.query(insertQuery, insertValues, (error, insertResults) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("User added succesfully.", insertResults);

            // return new user
            const userId = insertResults.insertId;
            const fetchQuery = 'SELECT * FROM stride.users WHERE user_id = ?;';
            const fetchValues = [userId];
            connection.query(fetchQuery, fetchValues, (error, fetchResults) => {
                if (error) {
                    console.log(error.sqlMessage);
                    return res.status(500).json({ error: error.sqlMessage });
                }
                res.status(200).json(fetchResults[0]);
            })
        });
        
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// get user with username
function getUserDetails(req, res) {
    const username = req.body.username;
    try {
        if (!username) return res.status(500).json({ error: "Missing username." });

        const query = 'SELECT * FROM stride.users WHERE username = ?;';
        const values = [username];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            const data = results[0];
            console.log("User details found succesfully.", data);
            res.status(200).json(data);
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// get user with id in req
function getUser(req, res) {
    const userId = req.params.id;
    try {
        if (!userId) return res.status(500).json({ error: "Missing user ID." });

        const query = 'SELECT * FROM stride.users WHERE user_id = ?';
        const values = [userId];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            const data = results[0];
            console.log(data);
            res.status(200).json(data);
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// delete user with id in req
function deleteUser(req, res) {
    const userId = req.params.id;
    try {
        if (!userId) return res.status(500).json({ error: "Missing user ID." });

        const query = 'DELETE FROM stride.users WHERE user_id = ?';
        const values = [userId];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log(results);
            res.status(200).json(results);
        })
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

module.exports = {
    createUser, 
    getUserDetails,
    getUser,
    deleteUser
}