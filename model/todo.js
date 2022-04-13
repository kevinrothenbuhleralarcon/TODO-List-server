/* AUTHOR: Kevin Rothenbühler-Alarcon */

const Task = require("./task")
const dayJs = require("../config/dayjs")

/** Class representing a Todo */
class Todo {

    /**
     * Constructor
     * @param {number} id 
     * @param {String} title 
     * @param {String} createdAt 
     * @param {String} lastUpdatedAt 
     * @param {number} userId 
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
     * Return a new Todo from the database row with dayjs from now for last updatedAt
     * @param {any} row 
     * @returns {Todo}
     */
    static fromRowFromNow(row) {
        return new Todo(
            row.id,
            row.title,
            dayJs(row.created_at).format("DD.MM.YYYY hh:mm:ss"),
            dayJs(row.last_updated_at).fromNow(),
            null
        )
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
            dayJs(row.created_at).format("DD.MM.YYYY hh:mm:ss"),
            dayJs(row.last_updated_at).format("DD.MM.YYYY hh:mm:ss"),
            null
        )
    }
}

module.exports = Todo