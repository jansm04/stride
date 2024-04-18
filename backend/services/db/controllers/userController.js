const connection = require('../config');

// insert user into db
function createUser(req, res) {
    const userInput = req.body;

    const userID = userInput.userID;
    const username = userInput.username;
    const password = userInput.password;

    // optional variables
    const firstName = userInput.firstName ? userInput.firstName : null;
    const lastName = userInput.lastName ? userInput.lastName : null;

    try {
        if (!userID || !username || !password)
            return res.status(500).json({ error: "Missing required variables" });

        const query = 'INSERT INTO stride.users ( user_id, username, password, first_name, last_name) VALUES (?, ?, ?, ?, ?);'
        const values = [userID, username, password, firstName, lastName];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.log(error.sqlMessage);
                return res.status(500).json({ error: error.sqlMessage });
            }
            console.log("User added succesfully.", results);
            res.status(200).json({ result: "User added succesfully." });
        });
        
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// get user with id in req
function getUser(req, res) {
    // todo
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
            res.status(200).json({ result: "User deleted succesfully." });
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