/* Author: Kevin Rothenbühler-Alarcon */

export default class TodoApi {

    constructor() {}

    /**
     * API call for login
     * @param {Object} data
     * @param {String} data.username 
     * @param {String} data.password 
     * @returns {Promise<{connected: boolean, value: object}>} boolean - true if connected; value - Json object of the response
     */
    async login(data) {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            const value = await response.json()
            return {
                connected: true,
                value: value
            }
        } else {
            const value = await response.text()
            return {
                connected: false,
                value: value
            }
        }        
    }

    /**
     * 
     * @param {Object} data
     * @param {String} data.username 
     * @param {String} data.email 
     * @param {String} data.password 
     * @returns {Promise<{connected: boolean, value: object}>} boolean - true if connected; value - Json object of the response
     */
    async register(data) {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            const value = await response.json()
            return {
                connected: true,
                value: value
            }
        } else {
            const value = await response.text()
            return {
                connected: false,
                value: value
            }
        }        
    }

    async getTodoList() {
        const response = await fetch("/api/todoList") 
        if (response.ok) {
            const data = await response.json()
            return data.todos
        } else {
            const data = await response.text()
            throw (data)
        }
    }
}