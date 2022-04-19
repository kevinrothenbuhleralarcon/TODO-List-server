/* AUTHOR: Kevin Rothenbühler-Alarcon */

const todoDao = require("../data/todoDao")
const Task = require("../model/task")
const Todo = require("../model/todo")

/**
 * Return the list of todos for a specific user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getTodoList = async function (req, res) {
    const userId = req.userId
    const todos = await todoDao.getTodosByUserId(userId)
    res.status(200).json({todos: todos})
}

/**
 * Return the list of todos for a specific user
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getTodo = async function (req, res) {
    const userId = req.userId
    const todo = await todoDao.getTodoById(req.query.id, userId)
    res.status(200).json({todo: todo})
}

exports.addTodo = async function(req, res) {
    const userId = req.userId
    const tasks = [
        new Task(null, "Create a first test todo", false, null, null),
        new Task(null, "Create a first task for the first todo", false, null, null),
        new Task(null, "Create a second task", false, null, null),
        new Task(null, "Create a third task", false, null, null),
    ]
    const todo = new Todo(null, "test", new Date(), new Date(), tasks)
    const result = await todoDao.addTodo(todo, userId)
    if (result) {
        res.status(200).send("ok")
    } else {
        res.status(400).send("not ok")
    }
    
}


//NOT CURRENTLY USED; FOR TEST PURPOSE ONLY
exports.upDateTodo = async function (req, res){
    /*const tasks = [
        new Task(1, "Create a first test todo", false, null, 1),
        new Task(2, "Create a first task for the first todo", false, null, 1),
        new Task(3, "Create a second task", false, null, 1),
        new Task(null, "Create a third task", false, null, 1),
    ]
    const test = new Todo(
        1,
        "first test todo",
        new Date(),
        new Date(),
        10,
        tasks
    )
    
    const results = await todoDao.updateTodo(test)
    console.log(results.length)*/
}