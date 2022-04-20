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
    /** @type {number} */
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
    /** @type {number} */
    const userId = req.userId
    const todo = await todoDao.getTodoById(req.query.id, userId)
    res.status(200).json({todo: todo})
}

/**
 * Store a new Todo in the database
 * @param {Request} req 
 * @param {Response} res 
 */
exports.addTodo = async function(req, res) {
    /** @type {number} */
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

/**
 * Update an existing Todo
 * @param {Request} req 
 * @param {Response} res 
 */
exports.updateTodo = async function (req, res){
    const reqTodo = req.body.todo    
    const todo = Todo.fromJson(reqTodo)    
    const result = await todoDao.updateTodo(todo)
    if(!result) {
        return res.status(400).send("Update failed")
    }    
    return res.status(200).send("Todo updated")
}