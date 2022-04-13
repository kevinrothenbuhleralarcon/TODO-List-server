/* AUTHOR: Kevin Rothenbühler-Alarcon */

const dayJs = require("../config/dayjs")

/** Class representing a Todo */
class Task {

    /**
     * Constructor
     * @param {number} id 
     * @param {String} description 
     * @param {boolean} status 
     * @param {?String} deadline 
     * @param {number} todoId 
     */
    constructor(
        id = null,
        description,
        status = false,
        deadline = null,
        todoId
    ) {
        this.id = id,
        this.description = description,
        this.status = status,
        this.deadline = deadline,
        this.todoId = todoId
    }

    static fromRow(row){
        return new Task(
            row.id,
            row.description,
            row.status,
            dayJs(row.deadline).format("DD.MM.YYYY hh:mm:ss"),
            row.todoId
        )
    }
}

module.exports = Task