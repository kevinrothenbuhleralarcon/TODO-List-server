/* AUTHOR: Kevin Rothenbühler-Alarcon */

const todoDao = require("../data/todoDao")

/**
 * Validate that the json passed in the body with the todo is valid
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
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
 * Validate that the json passed in the body with the todo is valid, that the combine todo id and user id is valid and that the todo on the server has not been updated more recently
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
exports.validateUpdateTodo = async function(req, res, next) {
    const todo = req.body.todo
    if (todo === undefined) {
        return res.status(400).send("Todo has to be defined")
    }
    if(todo.id === undefined || isNaN(Number(todo.id))) {
        return res.status(400).send("Todo id has to be defined and must be a number")
    }
    if(!(todo.title && todo.createdAt && todo.lastUpdatedAt && todo.tasks) || todo.tasks.length < 1) {
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
    const lastUpdatedAt = new Date(todo.lastUpdatedAt)
    if(isNaN(new Date(todo.createdAt) || isNaN(lastUpdatedAt))) {
        return res.status(400).send("The dates are not in a valid format")
    }
    /** @type {number} */
    const userId = req.userId
    const storedTodo = await todoDao.getTodoById(todo.id, userId)
    if (storedTodo === null) {
        return res.status(400).send("No todo with this id for the connected user")
    }
    if(storedTodo.lastUpdatedAt > lastUpdatedAt) {
        return res.status(400).send("The todo on the server has been more recently updated")
    }

    next()
}

/**
 * Check that the task description and status are present
 * @param {Any} task 
 * @returns {Boolean} 
 */
const validateTask = function(task) {
    if(task.id !== undefined && (task.id != null && isNaN(Number(task.id)))) {
        return false
    }
    if(task.todoId !== undefined && (task.todoId != null && typeof task.todoId != "number")) {
        return false
    }
    if(task.deadline !== undefined && (task.deadline != null && isNaN(new Date(task.deadline)))) {
        return false
    }
    return (task.description !== undefined) && (task.status !== undefined) && (typeof task.status == "boolean")
}