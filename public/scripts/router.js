/* Author: Kevin Rothenbühler-Alarcon */

import Login from "./views/auth/login.js"
import Register from "./views/auth/register.js"
import Todo from "./views/todo/todo.js"

const routes = [  
    { path: '/', view: Todo },
    { path: '/login', view: Login },
    { path: '/register', view: Register },
]

const pageContent = document.querySelector("#page-content")

/**
 * Add the content of the path to the main page
 * @param {string} path
 */
const loadPageContent = async function (path) {
    let route = routes.find(route => route.path == path)
    if (route) {
        const view = new route.view()
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

// Handel the navigate back and forward
window.addEventListener("popstate", () => loadPageContent(window.location.pathname))

// Handel the page reload
window.addEventListener("DOMContentLoaded", () => {
    loadPageContent(window.location.pathname)
})