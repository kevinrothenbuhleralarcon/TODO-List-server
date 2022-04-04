const userDao = require("../data/userDao")
const User = require("../model/User")

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = async function(req, res) {
    try {
        const users = await userDao.createUser(new User(
            null,
            "test",
            null,
            "1234"
        ))
        res.send(users)
    } catch (e) {
        console.log(e)
    }
    
}