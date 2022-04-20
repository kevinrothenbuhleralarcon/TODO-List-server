/* AUTHOR: Kevin Rothenbühler-Alarcon */

const Task = require("./task")

/** Class representing a Todo */
class Todo {

    /**
     * Constructor
     * @param {number} id 
     * @param {String} title 
     * @param {Date} createdAt 
     * @param {Date} lastUpdatedAt 
     * @param {Task[]} tasks 
     */
    constructor(
        id = null,
        title,
        createdAt,
        lastUpdatedAt,
        tasks = null
    ) {
        this.id = id,
        this.title = title,
        this.createdAt = createdAt,
        this.lastUpdatedAt = lastUpdatedAt,
        this.tasks = tasks
    }

     /**
     * Return a new Todo from the database row
     * @param {any} row 
     * @returns {Todo}
     */
    static fromRow(row) {
        return new Todo(
            row.id,
            row.title,
            new Date(row.created_at),
            new Date(row.last_updated_at),
            null
        )
    }

    /**
     * Return a new Todo from the json received from the client
     * @param {any} jsonTodo 
     * @returns {Todo}
     */
    static fromJson(jsonTodo) {
        return new Todo(
            jsonTodo.id,
            jsonTodo.title,
            new Date(jsonTodo.createdAt),
            new Date(jsonTodo.lastUpdatedAt),
            jsonTodo.tasks.map(task => Task.fromJson(task))
        )
    }
}

module.exports = Todo