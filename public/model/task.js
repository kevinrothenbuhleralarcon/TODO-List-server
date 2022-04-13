/* AUTHOR: Kevin Rothenbühler-Alarcon */

/** Class representing a Todo */
export default class Task {

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
}