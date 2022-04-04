const bcrypt = require("bcryptjs")
const jsonWebToken = require("jsonwebtoken")
const userDao = require("../data/userDao")
const User = require("../model/User")

/**
 * Register a new user and return an authentication token
 * @param {Request} req 
 * @param {Response} res 
 */
exports.registerUser = async function(req, res) {
    try {
        // Get the username, email and password received from the request and check if they are not empty
        const {username, email, password} = req.body
        if(!(username && email && password)) {
            return res.status(400).send("All input are required")
        }

        // Check if we already have an existing user with the email or username
        let oldUser = await userDao.getUserByEmail(email)
        if (oldUser !== null) {
            return res.status(400).send("Email already in use. Please login")
        }

        oldUser = await userDao.getUserByUsername(username)
        if (oldUser !== null) {
            return res.status(400).send("Username already in use. Please login")
        }

        // Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10)

        // Create the new user because we will use the id in the token
        const id = await userDao.createUser(new User(
            null,
            username,
            email.toLowerCase(),
            encryptedPassword,
            null,
            true
        ))

        const user = await userDao.getUserById(id)

        const token = jsonWebToken.sign(
            {user_id: id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.TOKEN_LIFE
            }
        )

        user.token = token
        userDao.updateUser(user)

        res.status(201)
        res.json({
            "username" : user.username,
            "token-lifetime" : process.env.TOKEN_LIFE,
            "token" : user.token
        })
    } catch (e) {
        console.log(e.sqlMessage)
    } 
    
}

/**
 * Delete an existing user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.deleteUser = async function(req, res) {
    const {id} = req.body
    if (!id) {
        return res.status(400).send("Id not valid")
    }
    const nbUserDeleted = await userDao.deleteUser(id)
    if (nbUserDeleted > 0) {
        res.status(201).send("User deleted")
    } else {
        res.status(400).send("No users with this id")
    }    
}