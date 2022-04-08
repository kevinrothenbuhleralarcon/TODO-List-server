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
        })
    }

    /* TO BE EXTRACTED IN A SEPARATE FILE FOR API REQUEST */
    async #loginApi(form, router) {
    
    }
}