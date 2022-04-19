/* AUTHOR: Kevin Rothenbühler-Alarcon */

import Task from "./task.js"

/** Class representing a Todo */
export default class Todo {

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
     * Create a todo object from the todo of the API
     * @param {Object} todoDto 
     * @returns {Todo}
     */
    static fromApi(todoDto) {
        return new Todo(
            todoDto.id,
            todoDto.title,
            new Date(todoDto.createdAt),
            new Date(todoDto.lastUpdatedAt),
            todoDto.tasks
        )
    }
}