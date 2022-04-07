/* Author: Kevin Rothenbühler-Alarcon */

import Login from "./views/auth/login.js"

const routes = [  
    { 
        path: '/',
        view: Login
    },
    { 
        path: '/about', 
        view: Login
    }
]

const root = document.querySelector("#root")

/**
 * Add the content of the path to the main page
 * @param {string} path
 */
const loadPageContent = async function (path) {
    let route = routes.find(route => route.path == path)
    if (route) {
        const view = new route.view()
        root.innerHTML = await view.getHtml()
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

// Hander the navigte back and forward
window.addEventListener("popstate", () => loadPageContent(window.location.pathname))
window.addEventListener("DOMContentLoaded", () => {
    loadPageContent(window.location.pathname)
})

const links = document.querySelectorAll("a")
links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        router(e.target.getAttribute("href"))
    })
})