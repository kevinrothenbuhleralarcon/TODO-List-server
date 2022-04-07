/* Author: Kevin Rothenbühler-Alarcon */

import AbstractView from "../abstractView.js"

export default class Login extends AbstractView {
    constructor() {
        super("Login")
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        const response = await fetch("./static/scripts/views/auth/login.html")
        const htmlContent = await response.text()
        return htmlContent  
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        const button = document.querySelector("#submit")
        const form = document.querySelector("#test")
        if(!button) return
        button.addEventListener("click", (e) => {
            e.preventDefault()
            router("/about")
        })
    }
}