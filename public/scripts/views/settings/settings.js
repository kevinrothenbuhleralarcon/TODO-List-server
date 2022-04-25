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

        // Remove the active class for the currently active link and add it to the clicked link
        const activeLink = tabDiv.querySelector(".tab-header .active")
        activeLink.classList.remove("active")
        a.parentNode.classList.add("active")

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
}