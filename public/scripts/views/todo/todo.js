/* Author: Kevin Rothenbühler-Alarcon */

import AbstractView from "../abstractView.js"

export default class Todo extends AbstractView {
    constructor() {
        super("Todo")
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        const response = await fetch("./static/scripts/views/todo/todo.html")
        const htmlContent = await response.text()
        return htmlContent  
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        try {
            const response = await fetch("/api/todoList")
            if(response.ok) {
                const data = await response.json()
                const h2 = document.querySelector("h2")
                h2.textContent = data.title
            } else {
                return router("/")
            }    
        } catch (err){
            console.log(err)
        }       
        
    }    
}