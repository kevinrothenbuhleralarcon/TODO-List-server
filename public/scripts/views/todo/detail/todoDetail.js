/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../../todoApi.js"
import AbstractView from "../../abstractView.js"
import Todo from "../../../../model/todo.js"
import Task from "../../../../model/task.js"

export default class TodoUpdate extends AbstractView {

    /** @type {!TodoApi} */
    #todoApi

    /** @type {?number} */
    #todoId

    /** @type {?HTMLDivElement} */
    #emptyTaskTemplate

     /** @type {?HTMLDivElement} */
     #errorDiv

     /**
     * Constructor
     * @param {TodoApi} todoApi
     */
    constructor(todoApi) {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const id = urlParams.get("id")
        if(id === null) {
            super("New todo")
        } else {
            super(`Edit todo ${id}`)
        }
        this.#todoId = id == null ? null : Number(id)
        this.#todoApi = todoApi
        this.#emptyTaskTemplate = null
        this.#errorDiv = null
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        try {
            const response = await fetch("./static/scripts/views/todo/detail/todoDetail.html")
            const htmlContent = await response.text()
            return htmlContent  
        } catch (err){
            return null
        }       
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        /** Add the action of the add task button */
        document.querySelector(".task-add-btn").addEventListener("click", (e) => {
            e.preventDefault()
            this.#addTask()
        })

        /** @type {HTMLButtonElement} */
        const btnSubmit = document.querySelector("#submit")
        btnSubmit.addEventListener("click", async (e) => {
            e.preventDefault()

            this.#cleanErrorMessage()

            /** Get the form data and validate them */
            const form = document.querySelector("#todo")
            /** @type {HTMLInputElement} */
            const title = form.querySelector("#todoTitle")
            /** @type {HTMLDivElement[]} */
            const tasksNodes = [...form.querySelectorAll(".task-content")]
            const errors = this.#validateForm(title, tasksNodes)
            if (errors.length > 0) return this.#displayError(errors)

            /** Create the todo to be sent to the server */
            const createdAt = document.querySelector(".form-content").getAttribute("created-at")
            /** @type {Todo} */
            const todo = new Todo(
                this.#todoId,
                title.value,
                createdAt === null ? new Date() : new Date(createdAt),
                new Date(),
                tasksNodes.map(task => {
                    const deadline = task.querySelector(".deadline").value
                    return new Task(
                        Number(task.getAttribute("id")),
                        task.querySelector(".description").value,
                        task.querySelector(".status").checked,
                        deadline === "" ? null : new Date(deadline),
                        this.#todoId
                    )
                })
            )    
            
            /** Send to todo to the api for insertion or update and redirect if or or display error message */
            try {
                let result
                if (this.#todoId === null) {
                    result = await this.#todoApi.addTodo(todo)
                } else {
                    result = await this.#todoApi.updateTodo(todo)
                }
                if (result.ok) {
                    router("/")
                } else {
                    this.#displayError([result.value])
                }
            } catch (err) {
                console.log(err)
            }                     
        })

        /** Set the title of the body and load the todo */
        console.log(this.#todoId)
        if (this.#todoId === null) {
            document.querySelector("h1").innerHTML = "New todo"
        } else {
            try {
                await this.#loadTodo()

                /** Add a delete button to delete an existing todo */
                /** @type {HTMLButtonElement} */
                const deleteButton = document.createElement("button")
                deleteButton.innerHTML = "Delete"
                deleteButton.addEventListener("click", async (e) => {
                    e.preventDefault()
                    const result = await this.#todoApi.deleteTodo(this.#todoId)
                    if (result.ok) {
                        router("/")
                    } else {
                        this.#displayError([result.value])
                    }
                })
                document.querySelector(".todo-form-button").append(deleteButton)
            } catch (err) {
                return 
            }            
        }
    }    

    /**
     * Get the todo from the server and populate a new task Div
     */
    async #loadTodo() {
        try {
            const todo = await this.#todoApi.getTodo(this.#todoId)
            if (todo === null) return
            document.querySelector("#todoTitle").value = todo.title
            document.querySelector(".form-content").setAttribute("created-at", todo.createdAt)
            for (const task of todo.tasks) {
                /** @type {?HTMLDivElement} */
                const taskNode = await this.#addTask()
                if (taskNode !== null) {
                    taskNode.setAttribute("id", task.id)
                    if(task.status) taskNode.querySelector(".status").click()
                    taskNode.querySelector(".description").value = task.description
                    if(task.deadline !== null) {
                        taskNode.querySelector(".deadline").valueAsDate = task.deadline
                    }                    
                }
            }
            document.querySelector("h1").innerHTML = todo.title
        } catch(err) {
            console.log(err)
        }        
    }

    /**
     * Add a new task Div element and return it
     * @returns {Promise<?HTMLDivElement>}
     */
    async #addTask() {
        if (this.#emptyTaskTemplate === null) {
            try {
                this.#emptyTaskTemplate = await this.#loadEmptyTaskTemplate()
            } catch (err) {
                console.log(err)
                return null
            }
        }
        const taskNode = this.#emptyTaskTemplate.cloneNode(true)
        taskNode.querySelector(".status").addEventListener("change", (e) => {
            /** @type {HTMLInputElement} */
            const description = taskNode.querySelector(".description")
            if (e.target.checked) {
                description.classList.add("line-through")
            } else {
                description.classList.remove("line-through")
            }
        })
        taskNode.querySelector(".task-content-button").addEventListener("click", (e) => {
            e.preventDefault()
            /** @type {HTMLButtonElement} */
            const btn = e.target
            /** @type {HTMLDivElement} */
            const task = btn.parentNode
            /** @type {HTMLDivElement} */
            const container = btn.parentNode.parentNode
            container.removeChild(task)
        }, {once: true})
        /** @type {HTMLDivElement} */
        const container = document.querySelector(".form-content")
        container.insertBefore(taskNode, container.querySelector(".todo-button"))
        return taskNode
    }

    /**
     * Load the task template
     * @returns {Promise<HTMLDivElement>}
     */
    async #loadEmptyTaskTemplate() {
        try {
            const html = await fetch("./static/scripts/views/todo/detail/taskDetail.html").then(response => response.text())
            /** @type {HTMLDivElement} */
            const element = document.createRange().createContextualFragment(html).querySelector(".task-content")
            if (element === null) throw `Element .task-content was not found on the page`
            return element
        } catch(err) {
            throw err
        }
    }

    /**
     * Remove the error div if any
     */
    #cleanErrorMessage() {
        if (this.#errorDiv) {
            this.#errorDiv.parentElement.removeChild(this.#errorDiv)
            this.#errorDiv = null
        }
    }

    /**
     * Validate the form and return an array of errors
     * @param {HTMLInputElement} title 
     * @param {NodeListOf<HTMLDivElement>} tasksNodes
     * @returns {String[]} errors
     */
    #validateForm(title, tasksNodes) {        
        /** @type {String[]} */
        const errors = []

        if (title.validity.valueMissing) errors.push("Title cannot be empty")
        if (tasksNodes.length < 1) {
            errors.push("At least one task is needed")
        } else {
            let descriptionEmpty = false
            tasksNodes.forEach(task => {
                if (task.querySelector(".description").validity.valueMissing) {
                    descriptionEmpty = true
                    return
                }
            })
            if (descriptionEmpty) errors.push("Description cannot be empty")
        }
        return errors
    }

    /**
     * Display an error on the form
     * @param {String[]} errors 
     */
     #displayError(errors) {
        /** @type {HTMLDivElement} */
        const formContent = document.querySelector(".form-content")
        this.#errorDiv = document.createElement("div")
        this.#errorDiv.classList.add("error")
        errors.forEach(error => {
            this.#errorDiv.innerHTML += error + "<br>"
        })        
        formContent.insertBefore(this.#errorDiv, formContent.firstChild)
    }
}