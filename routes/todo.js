/* AUTHOR: Kevin Rothenbühler-Alarcon */

const todoDao = require("../data/todoDao")
const Task = require("../model/task")
const Todo = require("../model/todo")

/**
 * Return the list of todos for a specific user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getTodoList = function (req, res) {
    const tasks = [
        new Task(1, "Create a first test todo", false, null, 1),
        new Task(2, "Create a first task", false, null, 1),
        new Task(3, "Create a second task", false, null, 1),
        new Task(null, "Create a third task", false, null, 1),
    ]
    const test = new Todo(
        1,
        "first test todo",
        Date.now(),
        Date.now(),
        10,
        tasks
    )

    //console.log(test)
    todoDao.updateTodo(test)

    const userId = req.userId
    res.status(200).json({"title": `Todo list for user: ${userId}`})
}