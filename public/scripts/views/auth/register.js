/* Author: Kevin Rothenbühler-Alarcon */

import AbstractView from "../abstractView.js"

export default class Rejister extends AbstractView {

    /**
     * Construct
     */
     constructor() {
        super("Register")
    }    

    /**
     * Return the html content of the page
     * @returns {Promise<String>} html content
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
        const submitButton = document.querySelector("#submit")
        const form = document.querySelector("#register")
        if(!(submitButton && form)) return

        submitButton.addEventListener("click", (e) => {
            e.preventDefault()

            if ((form.username.value === "") || (form.email.value === "") || (form.password.value === "") || (form.password2.value === "") || (form.password.value !== form.password2.value)) {
                /* TODO Show form validation error to the user */
                return console.log("Form invalid")
            }
            this.#registerApi(form, router)
        })
    }

    /* TO BE EXTRACTED IN A SEPARATE FILE FOR API REQUEST */
    async #registerApi(form, router) {
        const data =  {
            "username": form.username.value,
            "email" : form.email.value,
            "password": form.password.value
        }
        const response = await fetch("/api/register", {
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