/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../../todoApi.js"
import AbstractView from "../../abstractView.js"
import Todo from "../../../../model/todo.js"

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
        this.#todoId = id
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
        document.querySelector(".task-add-btn").addEventListener("click", (e) => {
            e.preventDefault()
            this.#addTask()
        })
        /** @type {HTMLButtonElement} */
        const btnSubmit = document.querySelector("#submit")
        btnSubmit.addEventListener("click", (e) => {
            e.preventDefault()
            this.#cleanErrorMessage()
            this.#validateForm(document.querySelector("#todo"))
        })

        if (this.#todoId === null) {
            document.querySelector("h1").innerHTML = "New todo"
        } else {
            document.querySelector("h1").innerHTML = `Edit todo ${this.#todoId}`
            try {
                await this.#loadTodos()
                /** @type {HTMLButtonElement} */
                const deleteButton = document.createElement("button")
                deleteButton.innerHTML = "Delete"
                deleteButton.addEventListener("click", (e) => {
                    e.preventDefault()
                    /** TODO */
                    console.log("Delete")
                })
            document.querySelector(".todo-form-button").append(deleteButton)
            } catch (err) {
                return 
            }            
        }
    }    

    async #loadTodos() {
        try {
            const todo = await this.#todoApi.getTodo(this.#todoId)
            if (todo === null) return
            document.querySelector("#todoTitle").value = todo.title
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
        } catch(err) {
            console.log(err)
            return
        }        
    }

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
        container.insertBefore(taskNode, container.querySelector(".todo-form-button"))
        return taskNode
    }

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
     * @param {HTMLFormElement} form
     * @returns {String[]} errors
     */
    #validateForm(form) {

        console.log(form.querySelector("#todoTitle").value)
        const tasksNodes = form.querySelectorAll(".task-content")
        console.log(tasksNodes)
        /*const username = this.#form.username

        const password = this.#form.password

        const errors = []
        if (username.validity.valueMissing) {
            errors.push("Username cannot be empty")
        }
        if(password.validity.valueMissing) {
            errors.push("Password cannot be empty")
        }
        return errors*/
    }
}