/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "../../todoApi.js"
import AbstractView from "../abstractView.js"

export default class Register extends AbstractView {

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
        super("Register")
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
        const response = await fetch("./static/scripts/views/auth/register.html")
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
        this.#form = document.querySelector("#register")
        if(!(this.#button && this.#form)) return

        this.#button.addEventListener("click", async(e) => {
            e.preventDefault()

            this.#cleanErrorMessage()            

            // Validate the form and display the errors if any
            const errors = this.#validateForm()
            if(errors.length > 0) {
                return this.#displayError(errors)
            }

            // Make the api call for user creation
            const response = await this.#todoApi.register({
                username: this.#form.username.value,
                email: this.#form.email.value,
                password: this.#form.password.value
            })

            // If connected redirect to the main page, otherwise display the server error message
            if(response.connected) {
                router("/")
            } else {
                return this.#displayError([response.value])
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
        const email = this.#form.email
        /** @type {HTMLInputElement} */
        const password1 = this.#form.password
        /** @type {HTMLInputElement} */
        const password2 = this.#form.password2
        /** @type {String[]} */
        const errors = []
        if (username.validity.valueMissing) {
            errors.push("Username cannot be empty")
        }
        if (email.validity.valueMissing) {
            errors.push("Email cannot be empty")
        }
        if (email.validity.typeMismatch) {
            errors.push("Email is not in valid format")
        }
        if(password1.validity.valueMissing || password2.validity.valueMissing) {
            errors.push("Passwords cannot be empty")
        }
        if(password1.validity.patternMismatch || password2.validity.patternMismatch) {
            errors.push("Password type mismatch")
        }
        if(password1.value !== password2.value) {
            errors.push("Passwords doesn't match")
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