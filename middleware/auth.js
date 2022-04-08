/* AUTHOR: Kevin Rothenbühler-Alarcon */

const jsonWebToken = require("jsonwebtoken")

/**
 * Verify the user Token and pass the user id of the token is valid
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies["x-access-token"]

    if(token === undefined) {
        return res.status(401).send("An access token is required to access this resource")
    }

    try {
        const decodedToken = jsonWebToken.verify(token, process.env.TOKEN_KEY)
        req.userId = decodedToken.user_id
    } catch (err) {
        return res.status(401).send("Invalid token")
    }

    return next()
}

module.exports = verifyToken