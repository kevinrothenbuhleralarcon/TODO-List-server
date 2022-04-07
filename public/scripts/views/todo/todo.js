/* Author: Kevin Rothenbühler-Alarcon */

import AbstractView from "../abstractView.js"

export default class Todo extends AbstractView {
    constructor() {
        super("Todo")
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        const response = await fetch("./static/scripts/views/todo/todo.html")
        const htmlContent = await response.text()
        return htmlContent  
    }

    /**
     * 
     * @param {import("../abstractView.js").navigateCallback} router 
     * @returns 
     */
    async executeViewScript(router) {
        /*const button = document.querySelector("#submit")
        const form = document.querySelector("#login")
        if(!(button && form)) return
        button.addEventListener("click", (e) => {
            e.preventDefault()
            if ((form.username.value === "") || (form.password.value === "")) {
                return console.log("Form invalid")
            }
            this.#loginApi(form, router)*/
            /*const data = {
                username: form.username.value
            }
            router("/about")*/
       // })
    }    

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
        let responseData = await response.json()
        console.log(responseData)
    }
}