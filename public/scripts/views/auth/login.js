/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../todoApi.js"
import AbstractView from "../abstractView.js"

export default class Login extends AbstractView {
    
    /** @type {?HTMLButtonElement} */
    #button
    /** @type {?HTMLFormElement} */
    #form
    /** @type {?HTMLDivElement} */
    #errorDiv
    /** @type {!TodoApi} */
    #todoApi

    /**
     * Constructor
     * @param {TodoApi} todoApi
     */
    constructor(todoApi) {
        super("Login")
        this.#button = null
        this.#form = null
        this.#errorDiv = null
        this.#todoApi = todoApi
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
     * The script of the view, the router is there for navigation
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        this.#button = document.querySelector("#submit")
        this.#form = document.querySelector("#login")
        if(!(this.#button && this.#form)) return
        this.#button.addEventListener("click", async (e) => {
            e.preventDefault()
            if (this.#errorDiv) {
                this.#errorDiv.parentElement.removeChild(this.#errorDiv)
                this.#errorDiv = null
            }
            if ((this.#form.username.value === "") || (this.#form.password.value === "")) {
                this.#displayError("All fields are required")
                return
            }
            const response = await this.#todoApi.login({
                    username: this.#form.username.value,
                    password: this.#form.password.value
                })
            if(response.connected) {
                router("/")
            } else {
                this.#displayError(response.value)
                return
            }
        })
    }
    
    /**
     * Display an error on the form
     * @param {String} error 
     */
    #displayError(error) {
        /** @type {HTMLDivElement} */
        const formContent = document.querySelector(".form-content")
        this.#errorDiv = document.createElement("div")
        this.#errorDiv.classList.add("error")
        this.#errorDiv.innerText = error
        formContent.insertBefore(this.#errorDiv, formContent.firstChild)
    }
}