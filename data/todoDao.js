/* AUTHOR: Kevin Rothenbühler-Alarcon */

const connection = require("../config/database")
const Todo = require("../model/todo")
const Task = require("../model/task")


//GET

/**
 * Return the list of Todo for a specific user
 * @param {number} userId 
 * @returns {Promise<?Todo[]>}
 */
exports.getTodosByUserId = async function(userId) {
    try {
        const [dbTodos] = await connection.promise().execute(
                "SELECT * FROM tbl_todos WHERE user_id = ?", 
                [userId]
            )
        if(dbTodos.length > 0) {
            /** @type {Todo[]} */
            const todos = dbTodos.map(row => Todo.fromRow(row) )
            await Promise.all(todos.map(async todo => {
                const [dbTasks] = await connection.promise().execute(
                    "SELECT * FROM tbl_tasks WHERE todo_id = ?",
                    [todo.id]
                )
                todo.tasks = dbTasks.map(dbTask => Task.fromRow(dbTask))
            }))
            return todos
        }
        return null
    } catch (err) {
        console.log(err)
        return null
    }
}

/**
 * Return a specific todo
 * @param {number} todoId 
 * @param {number} userId 
 * @returns {Promise<?Todo>}
 */
exports.getTodoById = async function(todoId, userId) {
    try {
        const [dbTodo] = await connection.promise().execute(
            "SELECT * FROM tbl_todos WHERE id = ? AND user_id = ? LIMIT 1",
            [todoId, userId]
        )
        if(dbTodo.length > 0) {
            const todo = Todo.fromRow(dbTodo[0])
            const [dbTasks] = await connection.promise().execute(
                "SELECT * FROM tbl_tasks WHERE todo_id = ?",
                [todo.id]
            )
            todo.tasks = dbTasks.map(dbTask => Task.fromRow(dbTask))
            return todo
        }
        return null
    } catch (err) {
        console.log(err)
        return null
    }
}

// ADD

/**
 * Add a new todo
 * @param {Todo} todo
 * @param {number} userId
 * @returns {Promise<boolean>} Return true if the todo was correctly added 
 */
exports.addTodo = async function(todo, userId) {
    try {
        const [result] = await connection.promise().execute(
            "INSERT INTO tbl_todos SET title = ?, created_at = ?, last_updated_at = ?, user_id = ?",
            [todo.title, todo.createdAt, todo.lastUpdatedAt, userId]
        )
        if(result.insertId > 0) {
            const [res] = await connection.promise().query(
                "INSERT INTO tbl_tasks (description, status, deadline, todo_id) VALUES ?",
                [todo.tasks.map(task => [task.description, task.status, task.deadline, result.insertId])],
            )
            return res.affectedRows == todo.tasks.length
        }
        return false
    } catch (err) {
        console.log(err)
        return false
    }
}

// UPDATE

/**
 * Update an existing Todo
 * @param {Todo} todo 
 * @returns {Promise<boolean>} Return true if the todo was correctly updated 
 */
 exports.updateTodo = async function(todo) {
    try {
        // Update the todo
       await connection.promise().execute(
            "UPDATE tbl_todos SET title = ?, last_updated_at = ? WHERE id = ?",
            [todo.title, todo.lastUpdatedAt, todo.id]
        )
        // Delete the tasks not present in the task list
        const [taskIds] = await connection.promise().execute(
            "SELECT id from tbl_tasks WHERE todo_id = ?",
            [todo.id]
        )
        /** @type {number[]} */
        const taskToDelete = taskIds.reduce((result, taskId) => {
            if(todo.tasks.find(task => task.id == taskId.id) === undefined) {
                result.push(taskId.id)
            }
            return result
        }, [])
        if (taskToDelete.length > 0) {
            await connection.promise().query(
                "DELETE FROM tbl_tasks WHERE id IN (?)",
                [taskToDelete],
            )
        }        

        // Insert all the tasks and update the existing one
        await Promise.all(todo.tasks.map(async task => {
            await connection.promise().execute(
                "INSERT INTO tbl_tasks (id, description, status, deadline, todo_id) VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = VALUES(id), description = VALUES(description), status = VALUES(status), deadline = VALUES(deadline), todo_id = VALUES(todo_id)",
                [task.id, task.description, task.status, task.deadline, todo.id]
            )
        }))
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}