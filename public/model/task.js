/* AUTHOR: Kevin Rothenbühler-Alarcon */

/** Class representing a Task */
export default class Task {

    /**
     * Constructor
     * @param {number} id 
     * @param {String} description 
     * @param {boolean} status 
     * @param {?Date} deadline 
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

    static fromApi(taskDto) {
        let deadline = null
        if(taskDto.deadline !== null) {
            deadline = new Date(taskDto.deadline)
        }
        return new Task(
            taskDto.id,
            taskDto.description,
            taskDto.status,
            deadline,
            taskDto.todoId
        )
    }
}