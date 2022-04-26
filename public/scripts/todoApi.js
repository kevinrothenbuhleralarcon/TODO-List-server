/* Author: Kevin Rothenbühler-Alarcon */

import Todo from "../model/todo.js"
import User from "../model/user.js"

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

    /**
     * API call for getting the connected user
     */
    async getUser() {
        try {
            const response = await fetch("/api/user")
            if(response.ok) {
                const data = await response.json()
                return User.fromApi(data)
            } 
                return null
        } catch (err) {
            throw (err)
        }
    }

    /**
     * API call for updating the connected user
     * @param {User}
     * @returns {Promise<{ok: boolean, value: ?string}>} - return true if the API call was sucessful, otherwise return false
     */
    async updateUser(user) {
        try {
            const response = await fetch("/api/updateUser", {
                method: "PUT",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            if(response.ok) {
                const data = await response.json()
                this.#connectionChanged(data.username)
                return {
                    ok: true,
                    value: data.res
                }
            } else {
                const data = await response.text()
                return {
                    ok: false,
                    value: data
                }
            }
        } catch (err) {
            throw err
        }
    }

    /**
     * API call for user disconnection
     */
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
                if(data.todos === null) return null
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
                if(data.todo === null) {
                    return null
                }
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

    /**
     * API call for adding a todo to the connected user
     * @param {Todo} todo 
     * @returns {Promise<{ok: boolean, value: ?string}>} - return true if the API call was sucessful, otherwise return false with the error message
     */
    async addTodo(todo) {
        try {
            const response = await fetch("/api/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({todo: todo})
            })

            if (response.ok) {
                return {
                    ok: true,
                    value: null
                }
            } else {
                const data = await response.text()
                return {
                    ok: false,
                    value: data
                } 
            }
        } catch (err) {
            throw (err)
        }
    }

    /**
     * API call for updating a todo of the connected user
     * @param {Todo} todo 
     * @returns {Promise<{ok: boolean, value: ?string}>} - return true if the API call was sucessful, otherwise return false with the error message
     */
    async updateTodo(todo) {
        try {
            const response = await fetch("/api/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({todo: todo})
            })

            if (response.ok) {
                return {
                    ok: true,
                    value: null
                }
            } else {
                const data = await response.text()
                return {
                    ok: false,
                    value: data
                } 
            }
        } catch (err) {
            throw (err)
        }
    }

    /**
     * API call for deleting a todo of the connected user
     * @param {number} todoId 
     * @returns {Promise<{ok: boolean, value: ?string}>} - return true if the API call was sucessful, otherwise return false with the error message
     */
     async deleteTodo(todoId) {
        try {
            const response = await fetch(`/api/delete?id=${todoId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                return {
                    ok: true,
                    value: null
                }
            } else {
                const data = await response.text()
                return {
                    ok: false,
                    value: data
                } 
            }
        } catch (err) {
            throw (err)
        }
    }
}