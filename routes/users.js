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

        if(!validatePassword(password)) return res.status(400).send("Invalid password template")

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
 * Disconnect the user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.disconnectUser = async function(req, res) {
    try {
        const userId = req.userId
        const user = await userDao.getUserById(userId)
        if(user) {
            user.token = null
            userDao.updateUser(user)
            res.clearCookie("x-access-token")
            return res.status(200).send("Disconnected")
        }
        res.status(400).send("Invalid Credential")
    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
    
}

/**
 * Get info of the connected user
 * @param {Request} req 
 * @param {Response} res 
 */

exports.getUser = async function(req, res) {
    const userId = req.userId
    try {
        const user = await userDao.getUserById(userId)
        if(user === null) return res.status(400).send("No user")
        res.status(200).json({
            username : user.username,
            email : user.email
        })
    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }    
}

/**
 * Update an existing user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.updateUser = async function(req, res) {
    const userId = req.userId
    const {username, oldPassword, newPassword, email} = req.body
    if(username === undefined && newPassword === undefined && email === undefined) return res.status(400).send("Nothing to change")
    try {
        const user = await userDao.getUserById(userId)

        if(username !== undefined && username !== null) {
            const existingUser = await userDao.getUserByUsername(username)
            if(existingUser !== null) return res.status(400).send("Username already in use.")
            user.username = username
        }

        if(email !== undefined && email !== null) {
            const existingUser = await userDao.getUserByEmail(email)
            if(existingUser !== null) return res.status(400).send("Email already in use.")
            user.email = email
        }

        if(newPassword !== undefined && newPassword !== null) {
            if (!await bcrypt.compare(oldPassword, user.password)) return res.status(400).send("Wrong password")
            if (!validatePassword(password)) return res.status(400).send("Invalid password template")
            const encryptedPassword = await bcrypt.hash(password, 10)
            user.password = encryptedPassword
        }
        
        const update = await userDao.updateUser(user)
        if(update) {
            res.status(200).json({
                res: "User updated",
                username : user.username,
                email: user.email
            })
        } else {
            res.status(400).send("Could not update the user")
        }
        
    } catch (err) {
        console.log(err)
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
        const userId = req.userId
        if (!userId) {
            return res.status(400).send("Id not valid")
        }
        const nbUserDeleted = await userDao.deleteUser(id)
        if (nbUserDeleted > 0) {
            res.status(200).send("User deleted")
        } else {
            res.status(400).send("No users with this id")
        }    
    } catch (e) {
        console.log(e)
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
        "token-lifetime" : process.env.TOKEN_LIFE + "h",
        "token" : token
    }
}

const validatePassword = function (password) {
    const regex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*!@#%^&(){}\[\]:;<>,\\.?/~_+\-=|]).{8,}$/)
    return regex.test(password)
}