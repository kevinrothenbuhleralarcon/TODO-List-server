/* Author: Kevin Rothenbühler-Alarcon */

import TodoApi from "./todoApi.js"

import AbstractView from "./views/abstractView.js"
import Login from "./views/auth/login.js"
import Register from "./views/auth/register.js"
import TodoList from "./views/todo/list/todoList.js"
import TodoDetail from "./views/todo/detail/todoDetail.js"
import Settings from "./views/settings/settings.js"

/** @type {Array.<{path: string, view: AbstractView>}>} */
const routes = [  
    { path: "/", view: TodoList },
    { path: "/detail", view: TodoDetail },
    { path: "/login", view: Login },
    { path: "/register", view: Register },
    { path: "/settings", view: Settings}
]

/** @type {HTMLDivElement} */
const dropdownContent = document.querySelector(".dropdown-content")

/**
 * Display the username on the header along with the user options dropdown list
 */
const displayUser = function() {
    const dropdown = document.querySelector(".dropdown")
    const connectedUser = window.localStorage.getItem("username")
    const header = document.querySelector("header")
    if (connectedUser !== null) {
        header.classList.remove("with-height")
        dropdown.classList.remove("hidden")
        dropdown.querySelector("#connected-user").innerHTML = connectedUser
    } else {
        header.classList.add("with-height")
        dropdown.classList.add("hidden")
    }
}

/**
 * Callback for the API to signal that the user connection has changed
 * @param {?String} username - the new username or null if the user is no longer connected
 */
const connectionChanged = function(username) {
    if(username === null) {
        window.localStorage.removeItem("username")
    } else {
        window.localStorage.setItem("username", username)
    }
    displayUser()
}

const todoApi = new TodoApi(connectionChanged)

/** @type {HTMLDivElement} */
const pageContent = document.querySelector("#page-content")

/**
 * Add the content of the path to the main page
 * @param {string} path
 */
const loadPageContent = async function (path) {
    const route = routes.find(route => route.path == path)
    if (route) {
        if((route.path == "/login" || route.path =="/register") && window.localStorage.getItem("username") !== null) {
            window.location.assign("/")
        }
        else {
            /** @type {AbstractView} */
            const view = new route.view(todoApi)
            pageContent.innerHTML = await view.getHtml()
            await view.executeViewScript(router)
        }       
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
    loadPageContent(window.location.pathname)
}

// Handle the navigate back and forward
window.addEventListener("popstate", () => {
    console.log("popstate")
    loadPageContent(window.location.pathname)
})

// Handle the page reload
window.addEventListener("DOMContentLoaded", () => {
    loadPageContent(window.location.pathname)
})

// Hide or show the user option on the click of the name (needed for mobile responsivness)
document.querySelector("#connected-user").addEventListener("click", () => {
    dropdownContent.classList.toggle("show")
})

// Hide the user option on a click outside the name if it's currently showed
window.addEventListener("click", (e) => {
    if(!e.target.matches("#connected-user")) {
        if ( dropdownContent.classList.contains("show")) {
            dropdownContent.classList.remove("show")
        }
    }
})

// Add the function to the disconnect link
document.querySelector("#disconnect-link").addEventListener("click", async(e) => {
    e.preventDefault()
    try {
        await todoApi.disconnect()
        router("/")
    } catch (err) {

    }    
})

// Add the function to the settings link
document.querySelector("#settings-link").addEventListener("click", async(e) => {
    e.preventDefault()
    router(e.target.pathname)
})

document.querySelector("#logo").addEventListener("click", (e) => router("/"))

displayUser()