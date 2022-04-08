/* Author: Kevin Rothenbühler-Alarcon */

import AbstractView from "../abstractView.js"

export default class Login extends AbstractView {

    /**
     * Constructor
     */
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
     * The script of the view, the router is there for navigation
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        const button = document.querySelector("#submit")
        const form = document.querySelector("#login")
        if(!(button && form)) return
        button.addEventListener("click", (e) => {
            e.preventDefault()
            if ((form.username.value === "") || (form.password.value === "")) {
                /* TODO Show form validation error to the user */
                return console.log("Form invalid")
            }
            this.#loginApi(form, router)
        })
    }    

    /* TO BE EXTRACTED IN A SEPARATE FILE FOR API REQUEST */
    async #loginApi(form, router) {
        const data =  {
            "username": form.username.value,
            "password": form.password.value
        }
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            router("/")
        } else {
            /* TODO Show form validation error from the server to the user */
            return console.log("invalid data")
        }        
    }
}