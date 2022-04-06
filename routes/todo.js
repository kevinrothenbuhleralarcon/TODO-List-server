/* AUTHOR: Kevin Rothenbühler-Alarcon */

/**
 * Return the list of todos for a specific user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getTodoList = function (req, res) {
    const userId = req.userId
    res.status(200).send(`Todo list for user: ${userId}`)
}