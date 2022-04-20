/* AUTHOR: Kevin Rothenbühler-Alarcon */

/** Class representing a Task */
class Task {

    /**
     * Constructor
     * @param {number} id 
     * @param {String} description 
     * @param {boolean} status 
     * @param {Date} deadline 
     * @param {number} todoId 
     */
    constructor(
        id = null,
        description,
        status = false,
        deadline = null,
        todoId = null
    ) {
        this.id = id,
        this.description = description,
        this.status = status,
        this.deadline = deadline,
        this.todoId = todoId
    }

    static fromRow(row){
        let deadline = null
        if(row.deadline !== null) {
            deadline = new Date(row.deadline)
        }
        return new Task(
            row.id,
            row.description,
            Boolean(row.status),
            deadline,
            row.todo_id
        )
    }

    static fromJson(taskJson) {
        let deadline = null
        if(taskJson.deadline !== undefined && taskJson.deadline !== null) {
            deadline = new Date(taskJson.deadline)
        }
        return new Task (
            taskJson.id,
            taskJson.description,
            taskJson.status,
            deadline,
            taskJson.todoId
        )
    }
}

module.exports = Task