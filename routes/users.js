/* AUTHOR: Kevin Rothenbühler-Alarcon */

const bcrypt = require("bcryptjs")
const jsonWebToken = require("jsonwebtoken")
const userDao = require("../data/userDao")
const User = require("../model/User")

/**
 * Register a new user and send an authentication token
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
        
        // Get the user previously created, generate the token and update the user with the token
        const user = await userDao.getUserById(id)
        const token = generateToken(user.id, user.email)
        user.token = token
        userDao.updateUser(user)


        // Return the a success to the user with the username, token lifetime and the token
        res.cookie("x-access-token", token, {
            maxAge: process.env.TOKEN_LIFE * 36000 * 60,
            secure: true,
            httpOnly: true
        })
        res.status(201).json(generateJsonResponseWithToken(user.username, user.token))
    } catch (e) {
        res.status(500).send("Server error")
    } 
}

/**
 * Login an existing user and send an authentication token
 * @param {Request} req 
 * @param {Response} res 
 */
exports.loginUser = async function(req, res) {
    try {
        const {username, password} = req.body
        if(!(username && password)) {
            return res.status(400).send("All input are required")
        }

        const user = await userDao.getUserByUsername(username)
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user.id, user.email)
            user.token = token
            userDao.updateUser(user)

            res.cookie("x-access-token", token, {
                maxAge: process.env.TOKEN_LIFE * 36000 * 60,
                secure: true,
                httpOnly: true
            })
            return res.status(200).json(generateJsonResponseWithToken(user.username, user.token))
        }

        res.status(400).send("Invalid Credential")
    } catch (e) {
        console.log(e)
        res.status(500).send("Server error")
    }
    
}

/**
 * Delete an existing user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.deleteUser = async function(req, res) {
    try {
        const {id} = req.body
        if (!id) {
            return res.status(400).send("Id not valid")
        }
        const nbUserDeleted = await userDao.deleteUser(id)
        if (nbUserDeleted > 0) {
            res.status(200).send("User deleted")
        } else {
            res.status(400).send("No users with this id")
        }    
    } catch (e) {
        res.status(500).send("Server error")
    }
   
}

/**
 * Generate a token from the user id and email
 * @param {Number} id 
 * @param {String} email 
 * @returns {String} token
 */
const generateToken = function (id, email) {
    return jsonWebToken.sign(
        {user_id: id, email},
        process.env.TOKEN_KEY,
        {
            expiresIn: process.env.TOKEN_LIFE + "h"
        })
}

/**
 * 
 * @param {String} username 
 * @param {String} token 
 * @returns {JSON} Json response
 */
const generateJsonResponseWithToken = function (username, token) {
    return {
        "username" : username,
        "token-lifetime" : process.env.TOKEN_LIFE,
        "token" : token
    }
}