/* AUTHOR: Kevin Rothenbühler-Alarcon */


/**
 * Validate that the json passed in the body with the todo is valid
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns 
 */
exports.validateAddTodo = async function(req, res, next) {
    const {title, createdAt, lastUpdatedAt, tasks} = req.body
    if(!(title && createdAt && lastUpdatedAt && tasks)) {
        return res.status(400).send("Invalid data")
    }
    if(isNaN(new Date(createdAt) || isNaN(new Date(lastUpdatedAt)))) {
        return res.status(400).send("Invalid data")
    }
}