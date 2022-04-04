const connection = require("../config/database")
const User = require("../model/User")

/**
 * 
 * @param {User} user 
 * @returns {Promise} Promise object representing the id of the inserted user
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