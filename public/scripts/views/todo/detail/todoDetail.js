/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../../todoApi.js"
import AbstractView from "../../abstractView.js"
import Todo from "../../../../model/todo.js"

export default class TodoUpdate extends AbstractView {

    /** @type {!TodoApi} */
    #todoApi

    /** @type {?number} */
    #todoId

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
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        const response = await fetch("./static/scripts/views/todo/detail/todoDetail.html")
        const htmlContent = await response.text()
        return htmlContent  
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        /** @type {HTMLHeadingElement} */
        const pageTitle = document.querySelector("h1")
        if (this.#todoId === null) {
            pageTitle.innerHTML = "New todo"
        } else {
            pageTitle.innerHTML = `Edit todo ${this.#todoId}`
        }

        try {
            const todo = await this.#todoApi.getTodo(this.#todoId)
            console.log(todo)
        } catch(err) {
            console.log(err)
            router("/") 
        }        
    }    
}