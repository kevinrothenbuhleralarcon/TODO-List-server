/* AUTHOR: Kevin Rothenbühler-Alarcon */

const connection = require("../config/database")
const Todo = require("../model/todo")
const Task = require("../model/task")
const dayJs = require("../config/dayjs")


/**
 * Return the list of Todo for a specific user
 * @param {number} userId 
 * @returns {Promise<?Todo[]>}
 */
exports.getTodosByUserId = async function(userId) {
    try {
        const [dbTodos, _] = await connection.promise().execute(
                "SELECT * FROM tbl_todos WHERE user_id = ?", 
                [userId]
            )
        if(dbTodos) {
            /** @type {Todo[]} */
            const todos = dbTodos.map(row => new Todo(row.id, row.title, dayJs(row.created_at).format("DD.MM.YYYY hh:mm:ss"), dayJs(row.last_updated_at).fromNow(), row.user_id, null) )

            await Promise.all(todos.map(async todo => {
                const [dbTasks, _] = await connection.promise().execute(
                    "SELECT * FROM tbl_tasks WHERE todo_id = ?",
                    [todo.id]
                )
                todo.tasks = dbTasks.map(dbTask => new Task(dbTask.id, dbTask.description, dbTask.status, dbTask.deadline, dbTask.todo_id))
            }))
            return todos
        }
        return null
    } catch (err) {
        return null
    }
}

// UPDATE

/**
 * Update an existing Todo
 * @param {Todo} todo 
 * @returns {Promise<results>} Promise object representing the id of the updated user
 */
 exports.updateTodo = async function(todo) {
     
    const results = []
    const errors = []
    console.log("Start update todo")
    const test = await connection.execute(
        "UPDATE tbl_todos SET id = ? , title = ?, created_at = ?, last_updated_at = ?, user_id = ? WHERE id = ?",
        [todo.id, todo.title, todo.createdAt, todo.lastUpdatedAt, todo.userId, todo.id]
        /*(err, result) => {
            if(err) reject(err)
            results.push(result)
            console.log("End update todo")
            //resolve(result)
        }*/
    )
    console.log(test)
    /*console.log("Start update tasks")
    todo.tasks.forEach(task => {
        console.log(`Start update task: ${task.id}`)
        connection.execute(
            "INSERT INTO tbl_tasks (id, description, status, deadline, todo_id) VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = VALUES(id), description = VALUES(description), status = VALUES(status), deadline = VALUES(deadline), todo_id = VALUES(todo_id)",
            [task.id, task.description, task.status, task.deadline, task.todoId],
            (err, result) => {
                if(err) reject(err)
                //console.log(result)
                results.push(result)
                console.log(`End update task: ${task.id}`)
            }
        )
    })*/
    return new Promise((resolve, reject) => {
        console.log("resolve")
        resolve(results)
    })
}