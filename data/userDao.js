const connection = require("../config/database")
const User = require("../model/User")

const convertUser = function(dbUser) {
    return new User(
        dbUser.id,
        dbUser.username,
        dbUser.email,
        dbUser.password,
        dbUser.token,
        dbUser.active
    )
}

// SELECT

/**
 * Return an existing user by username
 * @param {number} id 
 * @returns {Promise<User>} Promise object representing the User
 */
 exports.getUserById = function(id) {
    return new Promise((resolve, reject) => {
        connection.execute(
            "SELECT * FROM tbl_users WHERE id = ? LIMIT 1",
            [id],
            (err, result) => {
                if (err) reject(err)
                if (result[0] !== undefined ) {
                    resolve(convertUser(result[0]))
                } else {
                    resolve(null)
                }                
            }
        )
    })
}

/**
 * Return an existing user by username
 * @param {string} username 
 * @returns {Promise<User>} Promise object representing the User
 */
 exports.getUserByUsername = function(username) {
    return new Promise((resolve, reject) => {
        connection.execute(
            "SELECT * FROM tbl_users WHERE username = ? LIMIT 1",
            [username],
            (err, result) => {
                if (err) reject(err)
                if (result[0] !== undefined ) {
                    resolve(convertUser(result[0]))
                } else {
                    resolve(null)
                }                
            }
        )
    })
}

/**
 * Return an existing user by email
 * @param {string} email 
 * @returns {Promise<User>} Promise object representing the User
 */
exports.getUserByEmail = function(email) {
    return new Promise((resolve, reject) => {
        connection.execute(
            "SELECT * FROM tbl_users WHERE email = ? LIMIT 1",
            [email],
            (err, result) => {
                if (err) reject(err)
                if (result[0] !== undefined ) {
                    resolve(convertUser(result[0]))
                } else {
                    resolve(null)
                }                
            }
        )
    })
}


// INSERT

/**
 * Create a user in the database and return the inserted id
 * @param {User} user 
 * @returns {Promise<(number|null)>} Promise object representing the id of the inserted user
 */
 exports.createUser = function(user) {
    return new Promise((resolve, reject) => {
        connection.execute(
            "INSERT INTO tbl_users SET id = ?, username = ?, email = ?, password = ?, token = ?, active = ?",
            [user.id, user.username, user.email, user.password, user.token, user.active], 
            (err, result) => {
                if (err) reject(err)
                if(result !== undefined) {
                    resolve(result.insertId)
                } else {
                    resolve(null)
                }
                
            }
        )
    })
}


// UPDATE

/**
 * Update an existing user
 * @param {User} user 
 * @returns {Promise} Promise object representing the id of the updated user
 */
exports.updateUser = function(user) {
    return new Promise((resolve, reject) => {
        connection.execute(
            "UPDATE tbl_users SET username = ?, email = ?, password = ?, token = ?, active = ? WHERE id = ?",
            [user.username, user.email, user.password, user.token, user.active, user.id],
            (err, result) => {
                if (err) reject(err)
                resolve(result)
            }
        )
    })
}


// DELETE

/**
 * Delete a user
 * @param {number} id 
 * @returns {Promise<number>} Return the number of row deleted
 */
exports.deleteUser = function(id) {
    return new Promise((resolve, reject) => {
        connection.execute(
            "DELETE FROM tbl_users WHERE id = ?",
            [id],
            (err, result) => {
                if (err) reject(err)
                console.log(result)
                resolve(result)
            }
        )
    })
}