/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../../todoApi.js"
import AbstractView from "../../abstractView.js"

export default class Todolist extends AbstractView {

    /** @type {?HTMLDivElement} */
    #todoListPageContent
    /** @type {?HTMLDivElement} */
    #todoCardTemplate
    /** @type {!TodoApi} */
    #todoApi

     /**
     * Constructor
     * @param {TodoApi} todoApi
     */
    constructor(todoApi) {
        super("Todo list")
        this.#todoApi = todoApi
        this.#todoListPageContent = null
        this.#todoCardTemplate = null
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        const response = await fetch("./static/scripts/views/todo/list/todoList.html")
        const htmlContent = await response.text()
        return htmlContent  
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        this.#todoListPageContent = document.querySelector("#todo-list-content")
        try {
            const todos = await this.#todoApi.getTodoList()
            if (todos) {
                for (const todo of todos) {
                    await this.#createThumbnailCard(todo)
                }
            }
        } catch (err){
            console.log(err)
            router("/login")
        }       
        
    }    

    async #loadThumbnailTemplate() {
        try {
            const html = await fetch("./static/scripts/views/todo/list/todoThumbnail.html").then(response => response.text())
            const element = document.createRange().createContextualFragment(html).querySelector(".card")
            if (element === null) throw `Element .card was not found on the page`
            return element
        } catch (err) {
            return null
        }
    }

    async #createThumbnailCard(todo) {
        if (this.#todoCardTemplate === null) {
            try {
                this.#todoCardTemplate = await this.#loadThumbnailTemplate()
            } catch (err) {
                return
            }
        }
        const todoCard = this.#todoCardTemplate.cloneNode(true)
        todoCard.querySelector(".thumbnail-title").innerText = todo.title
        todoCard.querySelector(".created-at").innerText += todo.createdAt
        todoCard.querySelector(".last-updated-at").innerText += todo.lastUpdatedAt
        todoCard.addEventListener("click", this.#cardClick)
        this.#todoListPageContent.appendChild(todoCard)
    }

    #cardClick(e) {
        console.log("coucou")
    }
}