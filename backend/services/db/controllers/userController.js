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
            console.log("User add succesfully.", results);
            res.status(200).json({ result: "User add succesfully." });
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
    // todo
}

module.exports = {
    createUser, 
    getUser,
    deleteUser
}