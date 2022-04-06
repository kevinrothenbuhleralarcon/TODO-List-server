/* Author: Kevin Rothenbühler-Alarcon */

import About from "./views/about.js"

const routes = [  
    { 
        path: '/',
        data: `<h1>Welcome to Home page.</h1>
        <p>A home page is the main web page of a website. The term also refers to one or more pages always shown in a web browser when the application starts up.</p>`
    },
    { 
        path: '/about', 
        data: About
    },
    { 
        path: '/contact', 
        data: `<h1>Welcome to Contact page.</h1>      
        <p>A contact page is a common web page on a website for visitors to contact the organization or individual providing the website.</p>`
    }
]

const root = document.querySelector("#root")

/**
 * Add the content of the path to the main page
 * @param {string} path
 */
const addContent = async function (path) {
    let route = routes.find(route => route.path == path)
    console.log(route)
    if (route.path === "/about") {
        const view = new route.data()
        console.log("about")
        root.innerHTML = await view.getHtml()
    } else {
        root.innerHTML = route.data
    }
    
}

/**
 * Function that handle the page navigation
 * @param {Event} e 
 */
function router (e) {
    e.preventDefault()
    const path = e.target.getAttribute("href")
    window.history.pushState({}, "newUrl", e.target.href) // Add the url to the navigation history
    addContent(path)
}

// Hander the navigte back and forward
window.addEventListener("popstate", () => addContent(window.location.pathname))
window.addEventListener("DOMContentLoaded", () => {
    addContent(window.location.pathname)
})

const links = document.querySelectorAll("a")
links.forEach(link => {
    link.addEventListener("click", router)
})