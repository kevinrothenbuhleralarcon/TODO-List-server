/* Author: Kevin Rothenbühler-Alarcon */

import Todo from "../model/todo.js"

export default class TodoApi {

    #connectionChanged

    constructor(cb) {
        this.#connectionChanged = cb
    }

    /**
     * API call for login
     * @param {Object} data
     * @param {String} data.username 
     * @param {String} data.password 
     * @returns {Promise<{connected: boolean, value: object}>} boolean - true if connected; value - Json object of the response
     */
    async login(data) {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            if(response.ok) {
                const value = await response.json()
                this.#connectionChanged(value.username)
                return {
                    connected: true,
                    value: value
                }
            } else {
                const value = await response.text()
                this.#connectionChanged(null)
                return {
                    connected: false,
                    value: value
                }
            }        
        } catch (err) {
            throw (err)
        }        
    }

    /**
     * API call for account registration
     * @param {Object} data
     * @param {String} data.username 
     * @param {String} data.email 
     * @param {String} data.password 
     * @returns {Promise<{connected: boolean, value: object}>} boolean - true if connected; value - Json object of the response
     */
    async register(data) {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            if(response.ok) {
                const value = await response.json()
                this.#connectionChanged(value.username)
                return {
                    connected: true,
                    value: value
                }
            } else {
                const value = await response.text()
                this.#connectionChanged(null)
                return {
                    connected: false,
                    value: value
                }
            }        
        } catch (err) {
            throw (err)
        }        
    }

    async disconnect() {
        try {
            const response = await fetch ("/api/disconnect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if(response.status !== 500) {
                this.#connectionChanged(null)
            }
        } catch(err) {
            throw (err)
        }
    }

    /**
     * API call for getting the list of todo for the connected user
     * @returns {Promise<Todo[]>} Json object of the response (an array of Todo) or the error message from the API
     */
    async getTodoList() {
        try {
            const response = await fetch("/api/todoList") 
            if (response.ok) {
                const data = await response.json()
                return data.todos.map(todo => Todo.fromApi(todo))
            } else {
                if(response.status == 401) {
                    this.#connectionChanged(null)
                }
                const data = await response.text()
                throw (data)
            }
        } catch(err) {
            throw(err)
        }
        
    }

    /**
     * API call for getting a specific todo belonging to the connected user
     * @param {number} id 
     * @returns {Promise<?Todo>}
     */
    async getTodo(id) {
        try {
            const response = await fetch(`/api/todo?id=${id}`)
            if(response.ok) {
                const data = await response.json()
                return Todo.fromApi(data.todo)
            } else {
                if(response.status == 401) {
                    this.#connectionChanged(null)
                }
                const data = await response.text()
                throw(data)
            }
        } catch (err) {
            throw (err)
        }        
    }
}