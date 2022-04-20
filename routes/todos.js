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
    const reqTodo = req.body.todo
    
    const todo = new Todo(null, reqTodo.title, new Date(reqTodo.createdAt), new Date(reqTodo.lastUpdatedAt), reqTodo.tasks.map(task => Task.fromJson(task)))
    const result = await todoDao.addTodo(todo, userId)
    if (result) {
        res.status(200).send("New todo added")
    } else {
        res.status(400).send("Failed to insert the new todo")
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