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
    
}

module.exports = User