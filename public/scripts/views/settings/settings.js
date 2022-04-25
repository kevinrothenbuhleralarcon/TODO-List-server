/* Author: Kevin Rothenbühler-Alarcon */

import AbstractView from "../abstractView.js"
import TodoApi from "../../todoApi.js"

export default class Settings extends AbstractView {

    /** @type {TodoApi} */
    #todoApi

    /**
     * Constructor
     * @param {TodoApi} todoApi
     */
    constructor(todoApi) {
        super("Settings")
        this.#todoApi = todoApi
    }

    /**
     * Return the html content of the page as string
     * @returns {Promise<String>}
     */
    async getHtml() {
        try {
            const response = await fetch("./static/scripts/views/settings/settings.html")
            const htmlContent = await response.text()
            return htmlContent  
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
        const tabsLinks = document.querySelectorAll(".tab-header a")
        tabsLinks.forEach(a => {
            a.addEventListener("click", (e) => {
                e.preventDefault()
                window.history.pushState({}, "newUrl", a.href)
                this.#showTab(a)
            })
        })
    }

    /**
     * 
     * @param {HTMLAnchorElement} a 
     */
    #showTab(a) {
        const tabDiv = a.parentNode.parentNode.parentNode
        if(a.parentNode.classList.contains("active")) return false

        const activeLink = tabDiv.querySelector(".tab-header .active")
        console.log(activeLink)
        activeLink.classList.remove("active")
        console.log(a.parentNode)
        a.parentNode.classList.add("active")
    }

}