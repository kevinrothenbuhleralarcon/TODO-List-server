/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../../todoApi.js"
import AbstractView from "../../abstractView.js"

export default class TodoUpdate extends AbstractView {

    /** @type {!TodoApi} */
    #todoApi

     /**
     * Constructor
     * @param {TodoApi} todoApi
     */
    constructor(todoApi) {
        super("Todo update")
        this.#todoApi = todoApi
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        const response = await fetch("./static/scripts/views/todo/update/todoupdate.html")
        const htmlContent = await response.text()
        return htmlContent  
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const todoId = urlParams.get("id")
        if (todoId === null) return router("/")
        try {
            const todo = await this.#todoApi.getTodo(todoId)
            console.log(todo.title)
        } catch(err) {
            console.log(err)
            router("/") 
        }        
    }    
}