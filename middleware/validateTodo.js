/* AUTHOR: Kevin Rothenbühler-Alarcon */


/**
 * Validate that the json passed in the body with the todo is valid
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns 
 */
exports.validateAddTodo = async function(req, res, next) {
    const todo = req.body.todo
    if(!(todo && todo.title && todo.createdAt && todo.lastUpdatedAt && todo.tasks) || todo.tasks.length < 1) {
        return res.status(400).send("Todo title, created at, last updated at and at least one task are required")
    }
    let areAllTasksValid = true
    await Promise.all(todo.tasks.map(async task => {
        if(!validateTask(task)) {
            areAllTasksValid = false
        }
    }))
    if(!areAllTasksValid) {
        return res.status(400).send("Invalid Task data")
    }
    if(isNaN(new Date(todo.createdAt) || isNaN(new Date(todo.lastUpdatedAt)))) {
        return res.status(400).send("The dates are not in a valid format")
    }

    next()
}

/**
 * Check that the task description and status are present
 * @param {Any} task 
 * @returns {Boolean} 
 */
const validateTask = function(task) {
    if(task.id !== undefined && typeof task.id != "number") {
        return false
    }
    if(task.todoId !== undefined && typeof task.todoId != "number") {
        return false
    }
    if(task.deadline !== undefined && isNaN(new Date(task.deadline))) {
        return false
    }
    return (task.description !== undefined) && (task.status !== undefined) && (typeof task.status == "boolean")
}