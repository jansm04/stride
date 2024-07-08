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

        const query = 'INSERT INTO stride.users ( username, password, first_name, last_name) VALUES (?, ?, ?, ?);'
        const values = [username, password, firstName, lastName];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("User added succesfully.", results);
            res.status(200).json(results);
        });
        
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// get user with id in req
function getUser(req, res) {
    const username = req.body.username;
    try {
        if (!username) return res.status(500).json({ error: "Missing username." });

        const query = 'SELECT * FROM stride.users WHERE username = ?';
        const values = [username];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            const data = results[0];
            console.log("User fetched succesfully.", data);
            res.status(200).json(data);
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// delete user with id in req
function deleteUser(req, res) {
    const userID = req.params.id;
    try {
        if (!userID) return res.status(500).json({ error: "Missing user ID." });

        const query = 'DELETE FROM stride.users WHERE user_id = ?';
        const values = [userID];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("User deleted succesfully.", results);
            res.status(200).json(results);
        })
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

module.exports = {
    createUser, 
    getUser,
    deleteUser
}