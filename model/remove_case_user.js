/* AUTHOR: Kevin Rothenbühler-Alarcon */

/** Class representing a User */
class User {

    /**
     * Create a user
     * @param {number} id 
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @param {string} token 
     * @param {boolean} active 
     */
    constructor(
        id = null,
        username,
        email,
        password,
        token = null,
        active = false
    ){
        this.id = id
        this.username = username
        this.email = email
        this.password = password
        this.token = token
        this.active = active
    }

    /**
     * Return a new User from the database row
     * @param {any} row 
     * @returns {User}
     */
    static fromRow(row) {
        return new User(
            row.id,
            row.username,
            row.email,
            row.password,
            row.token,
            row.active
        )
    }
}

module.exports = User