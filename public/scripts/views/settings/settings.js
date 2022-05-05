/* Author: Kevin Rothenbühler-Alarcon */

import AbstractView from "../remove_case_abstractView.js"
import TodoApi from "../../todoApi.js"
import User from "../../../model/user.js"

export default class Settings extends AbstractView {

    /** @type {TodoApi} */
    #todoApi

    /** @type {?HTMLDivElement} */
    #messageDiv

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
        this.#messageDiv = null
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
     * @param {import("../remove_case_abstractView.js").navigateCallback} router 
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

        document.querySelector("#submit").addEventListener("click", async (e) => {
            e.preventDefault()
            this.#cleanErrorMessage()

            const errors = this.#validateForm()
            if (errors.length > 0) return this.#displayError(errors)
            
            if (this.#activeTab !== "#delete") {
                const response = await this.#updateUser()
                if (response.ok) {
                    this.#user = response.user
                    this.#displaySuccess([response.value])
                } else {
                    this.#displayError([response.value])
                }
            } else {
                /** @type {HTMLInputElement} */
                const inputCurrentPassword = document.querySelector("#input-current-password")
                try {
                    const response = await this.#todoApi.deleteUser(inputCurrentPassword.value)
                    if (response.ok) {
                        router("/")
                    } else {
                        this.#displayError([response.value])
                    }
                } catch (err) {
                    console.log(err)
                }                
            }            
        })
    }    
    
    /**
     * Load the user if not already loaded and set the username and email
     */
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
        if (this.#messageDiv) {
            this.#messageDiv.parentElement.removeChild(this.#messageDiv)
            this.#messageDiv = null
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
                /** @type {HTMLInputElement} */
                const inputPassword1 = document.querySelector(`#input-password`)
                /** @type {HTMLInputElement} */
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
                    errors.push("Email cannot be empty")
                }
                break;
            
            case "#delete":
                /** @type {HTMLInputElement} */
                const inputCurrentPassword = document.querySelector("#input-current-password")
                if (inputCurrentPassword.validity.valueMissing) {
                    errors.push("You must enter your password")
                }
                break;

            default:
                console.log("Not a tab")
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
        this.#messageDiv = document.createElement("div")
        this.#messageDiv.classList.add("error")
        errors.forEach(error => {
            this.#messageDiv.innerHTML += error + "<br>"
        })        
        formContent.insertBefore(this.#messageDiv, formContent.firstChild)
    }

    /**
     * Display a success on the form
     * @param {String[]} success 
     */
     async #displaySuccess(success) {
        await this.#displayUserInfo()
        /** @type {HTMLDivElement} */
        const formContent = document.querySelector(".form-content")
        this.#messageDiv = document.createElement("div")
        this.#messageDiv.classList.add("success")
        success.forEach(error => {
            this.#messageDiv.innerHTML += error + "<br>"
        })        
        formContent.insertBefore(this.#messageDiv, formContent.firstChild)
    }

    /**
     * Make the API call
     * @returns {Promise<{ok: boolean, value: ?string, user: ?User}>} - return true if the API call was sucessful, otherwise return false
     */
    async #updateUser() {
        /** @type {?User} */
        let user = null
        switch (this.#activeTab) {
            case "#username":
                /** @type {HTMLInputElement} */
                const inputUsername = document.querySelector(`#input-username`)
                user = new User(inputUsername.value, null, null, null)
                break;
            
            case "#password":
                /** @type {HTMLInputElement} */
                const oldPassword = document.querySelector("#input-old-password")
                /** @type {HTMLInputElement} */
                const inputPassword1 = document.querySelector(`#input-password`)
                user = new User(null, null, oldPassword.value, inputPassword1.value)
                this.#cleanPasswordFields()
                break;

            case "#email":
                /** @type {HTMLInputElement} */
                const inputEmail = document.querySelector(`#input-email`)
                user = new User(null, inputEmail.value, null, null)
                break;
            default:
                console.log("Not a tab")
        }

        if (user === null) return
        return await this.#todoApi.updateUser(user)
    }

    /**
     * Remove the content of the passwords fields
     */
    #cleanPasswordFields() {
        document.querySelector("#input-old-password").value = ""
        document.querySelector(`#input-password`).value = ""
        document.querySelector(`#input-password2`).value = ""
    }
}