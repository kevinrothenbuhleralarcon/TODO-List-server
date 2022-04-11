/* AUTHOR: Kevin Rothenbühler-Alarcon */

const connection = require("../config/database")
const Todo = require("../model/todo")
const Task = require("../model/task")

// UPDATE

/**
 * Update an existing Todo
 * @param {Todo} todo 
 * @returns {Promise<results>} Promise object representing the id of the updated user
 */
 exports.updateTodo = function(todo) {
     const results =[]
     return new Promise((resolve, reject) => {
        connection.execute(
            "UPDATE tbl_todos SET id = ? , title = ?, created_at = ?, last_updated_at = ?, user_id = ? WHERE id = ?",
            [todo.id, todo.title, todo.createdAt, todo.lastUpdatedAt, todo.userId, todo.id],
            (err, result) => {
                if(err) reject(err)
                results.push(result)
            }
        )
        console.log(todo.tasks[0])
        connection.execute(
            "INSERT INTO tbl_tasks (id, description, status, deadline, todo_id) VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = VALUES(id), description = VALUES(description), status = VALUES(status), deadline = VALUES(deadline), todo_id = VALUES(todo_id)",
            [todo.tasks[0].id, todo.tasks[0].description, todo.tasks[0].status, todo.tasks[0].deadline, todo.tasks[0].todo_id],
            (err, result) => {
                if(err) reject(err)
                results.push(result)
            }
        )
        
        /*todo.tasks.forEach(task => {
            connection.execute(
                "INSERT INTO tbl_tasks (id, description, status, deadline, todo_id) VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = VALUES(id), description = VALUES(description), status = VALUES(status), deadline = VALUES(deadline), todo_id = VALUES(todo_id)",
                [task.id, task.description, task.status, task.deadline, task.todo_id],
                (err, result) => {
                    if(err) reject(err)
                    results.push(result)
                }
            )
        })*/

        resolve(results)
     })
}