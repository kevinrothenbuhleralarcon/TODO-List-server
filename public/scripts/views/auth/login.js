/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../todoApi.js"
import AbstractView from "../remove_case_abstractView.js"

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
     * @param {import("../remove_case_abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        document.querySelectorAll("#page-content a").forEach(a => {
            a.addEventListener("click", (e) => {
                e.preventDefault()
                router(a.pathname)
            })
        })

        this.#button = document.querySelector("#submit")
        this.#form = document.querySelector("#login")
        if(!(this.#button && this.#form)) return
        this.#button.addEventListener("click", async (e) => {
            e.preventDefault()
            this.#cleanErrorMessage()
            
            // Validate the form and display the errors if any
            const errors = this.#validateForm()
            if(errors.length > 0) {
                return this.#displayError(errors)
            }

            const response = await this.#todoApi.login({
                    username: this.#form.username.value,
                    password: this.#form.password.value
                })
            if(response.connected) {
                router("/")
            } else {
                this.#displayError([response.value])
                return
            }
        })
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
     * @returns {String[]} errors
     */
     #validateForm() {
        /** @type {HTMLInputElement} */
        const username = this.#form.username
        /** @type {HTMLInputElement} */
        const password = this.#form.password
        /** @type {String[]} */
        const errors = []
        if (username.validity.valueMissing) {
            errors.push("Username cannot be empty")
        }
        if(password.validity.valueMissing) {
            errors.push("Password cannot be empty")
        }
        return errors
    }
    
    /**
     * Display an error on the form
     * @param {Array.<String>} errors 
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