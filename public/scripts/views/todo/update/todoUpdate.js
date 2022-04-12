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
        
    }    
}