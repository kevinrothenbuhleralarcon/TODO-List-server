/* AUTHOR: Kevin Rothenbühler-Alarcon */

/** Class representing a Todo */
class Todo {

    /**
     * Constructor
     * @param {number} id 
     * @param {String} title 
     * @param {Date} createdAt 
     * @param {Date} lastUpdatedAt 
     * @param {number} userId 
     * @param {Task[]} tasks 
     */
    constructor(
        id = null,
        title,
        createdAt,
        lastUpdatedAt,
        userId,
        tasks = null
    ) {
        this.id = id,
        this.title = title,
        this.createdAt = createdAt,
        this.lastUpdatedAt = lastUpdatedAt,
        this.userId = userId
        this.tasks = tasks
    }
}

module.exports = Todo