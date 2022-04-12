/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "./todoApi.js"

import AbstractView from "./views/abstractView.js"
import Login from "./views/auth/login.js"
import Register from "./views/auth/register.js"
import TodoList from "./views/todo/list/todoList.js"

/** @type {Array.<{path: string, view: AbstractView>}>} */
const routes = [  
    { path: '/', view: TodoList },
    { path: '/login', view: Login },
    { path: '/register', view: Register },
]

const todoApi = new TodoApi()

/** @type {HTMLDivElement} */
const pageContent = document.querySelector("#page-content")

/**
 * Add the content of the path to the main page
 * @param {string} path
 */
const loadPageContent = async function (path) {
    let route = routes.find(route => route.path == path)
    if (route) {
        /** @type {AbstractView} */
        const view = new route.view(todoApi)
        pageContent.innerHTML = await view.getHtml()
        await view.executeViewScript(router)
    } else {
        window.location.assign("/")
    }    
}

/**
 * Function that handle the page navigation
 * @param {String} path 
 */
function router (path) {
    window.history.pushState({}, "newUrl", window.location.origin + path) // Add the url to the navigation history
    loadPageContent(path)
}

// Handle the navigate back and forward
window.addEventListener("popstate", () => loadPageContent(window.location.pathname))

// Handle the page reload
window.addEventListener("DOMContentLoaded", () => {
    loadPageContent(window.location.pathname)
})