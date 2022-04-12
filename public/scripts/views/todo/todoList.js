/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../todoApi.js"
import AbstractView from "../abstractView.js"

export default class Todolist extends AbstractView {

    /** @type {!TodoApi} */
    #todoApi

     /**
     * Constructor
     * @param {TodoApi} todoApi
     */
    constructor(todoApi) {
        super("Todo list")
        this.#todoApi = todoApi
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        const response = await fetch("./static/scripts/views/todo/todoList.html")
        const htmlContent = await response.text()
        return htmlContent  
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        const todoListPageContent = document.querySelector("#todo-list-content")
        try {
            const todos = await this.#todoApi.getTodoList()
            if (todos) {
                const todoCardTemplate = await this.#loadTodoCard()
                todos.forEach(todo => {
                    const todoCard = todoCardTemplate.cloneNode(true)
                    todoCard.querySelector("h3").innerText = todo.title
                    todoListPageContent.appendChild(todoCard)
                })
            }
        } catch (err){
            console.log(err)
            router("/login")
        }       
        
    }    

    async #loadTodoCard() {
        try {
            const html = await fetch("./static/scripts/views/todo/todoThumbnail.html").then(response => response.text())
            const element = document.createRange().createContextualFragment(html).querySelector(".card")
            if (element === null) throw `Element .card was not found on the page`
            return element
        } catch (err) {
            return null
        }
    }
}