/* Author: Kevin Rothenbühler-Alarcon */

import AbstractView from "../abstractView.js"
import TodoApi from "../../todoApi.js"

export default class Settings extends AbstractView {

    /** @type {TodoApi} */
    #todoApi

    /** @type {?HTMLDivElement} */
    #errorDiv

    /** @type {String} */
    #activeTab

    /** @type {?User} */
    #user

    /**
     * Constructor
     * @param {TodoApi} todoApi
     */
    constructor(todoApi) {
        super("Settings")
        this.#todoApi = todoApi
        this.#errorDiv = null
        this.#activeTab = "#username"
        this.#user = null
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        try {
            const response = await fetch("./static/scripts/views/settings/settings.html")
            const htmlContent = await response.text()
            /** @type {HTMLDivElement} */
            const settings = document.createRange().createContextualFragment(htmlContent).querySelector(".settings")
            const linkList = settings.querySelectorAll(".tab-header a")
            for (const a of linkList) {
                const strContent = await fetch(`./static/scripts/views/settings/tabs/${(a.hash).substring(1)}.html`).then(response => response.text())
                const docContent = document.createRange().createContextualFragment(strContent).querySelector(".tab-content")
                settings.querySelector(".form-content").insertBefore(docContent, settings.querySelector("#submit"))
            }
            return settings.innerHTML 
        } catch (err){
            return null
        }       
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        await this.#displayUserInfo()
        
        const tabsLinks = document.querySelectorAll(".tab-header a")
        tabsLinks.forEach(a => {
            a.addEventListener("click", (e) => {
                e.preventDefault()
                window.history.pushState({}, "newUrl", a.href)
                this.#showTab(a)
            })
        })

        document.querySelector("#submit").addEventListener("click", (e) => {
            e.preventDefault()
            this.#cleanErrorMessage()
            if(this.#activeTab !== "#delete") {
                const errors = this.#validateForm()
                if (errors.length > 0) return this.#displayError(errors)
            }
            
            this.#updateUser()
        })
    }    
    
    async #displayUserInfo() {
        if(this.#user === null ) {
            // load the user info
            try {
                const user = await this.#todoApi.getUser()
                if(user !== null) {
                    this.#user = user
                } else {
                    return
                }
            } catch (err) {
                console.log(err)
            }
        }

        document.querySelector("#input-username").value = this.#user.username
        document.querySelector("#input-email").value = this.#user.email
    }

    /**
     * 
     * @param {HTMLAnchorElement} a 
     */
    #showTab(a) {
        const tabDiv = a.parentNode.parentNode.parentNode
        if(a.parentNode.classList.contains("active")) return false

        this.#cleanErrorMessage()

        // Remove the active class for the currently active link and add it to the clicked link
        const activeLink = tabDiv.querySelector(".tab-header .active")
        activeLink.classList.remove("active")
        a.parentNode.classList.add("active")
        this.#activeTab = a.hash

        // Remove the active class for the currently active tab content and add it the the content linked to the clicked link
        const activeContent = tabDiv.querySelector(".tab-contents .active")
        activeContent.classList.remove("active")
        const selectedContent = tabDiv.querySelector(`.tab-contents ${a.hash}`)
        selectedContent.classList.add("active")

        if(a.hash === "#delete") {
            document.querySelector("#submit").textContent = "Delete"
        } else {
            document.querySelector("#submit").textContent = "Submit"
        }
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
     * @param {HTMLInputElement} title 
     * @param {NodeListOf<HTMLDivElement>} tasksNodes
     * @returns {String[]} errors
     */
    #validateForm() {
        /** @type {String[]} */
        const errors = []
        switch (this.#activeTab) {
            case "#username":
                /** @type {HTMLInputElement} */
                const inputUsername = document.querySelector(`#input-username`)

                if(inputUsername.validity.valueMissing) {
                    errors.push("Username cannot be empty")
                }
                break;
            
            case "#password":
                /** @type {HTMLInputElement} */
                const oldPassword = document.querySelector("#input-old-password")
                const inputPassword1 = document.querySelector(`#input-password`)
                const inputPassword2 = document.querySelector(`#input-password2`)

                if(oldPassword.validity.valueMissing || inputPassword1.validity.valueMissing || inputPassword2.validity.valueMissing) {
                    errors.push("Passwords cannot be empty")
                }
                if(inputPassword1.validity.patternMismatch || inputPassword2.validity.patternMismatch) {
                    errors.push("Password type mismatch")
                }
                if(inputPassword1.value !== inputPassword2.value) {
                    errors.push("The new passwords doesn't match")
                }
                break;

            case "#email":
                /** @type {HTMLInputElement} */
                const inputEmail = document.querySelector(`#input-email`)

                if(inputEmail.validity.valueMissing) {
                    errors.push("email cannot be empty")
                }
                break;
            default:
                console.log("not a tab")
        }

        return errors
    }

    /**
     * Display an error on the form
     * @param {String[]} errors 
     */
    async #displayError(errors) {
        await this.#displayUserInfo()
        /** @type {HTMLDivElement} */
        const formContent = document.querySelector(".form-content")
        this.#errorDiv = document.createElement("div")
        this.#errorDiv.classList.add("error")
        errors.forEach(error => {
            this.#errorDiv.innerHTML += error + "<br>"
        })        
        formContent.insertBefore(this.#errorDiv, formContent.firstChild)
    }

    #updateUser() {

    }
}