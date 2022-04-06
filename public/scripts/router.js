/* Author: Kevin Rothenbühler-Alarcon */

const routes = [  
    { 
        path: '/',
        data: `<h1>Welcome to Home page.</h1>
        <p>A home page is the main web page of a website. The term also refers to one or more pages always shown in a web browser when the application starts up.</p>`
    },
    { 
        path: '/about', 
        data: `<h1>Welcome to About page.</h1>      
        <p>The About page is the section of a website where people go to find out about the website they're on.</p>`
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
const addContent = function (path) {
    let route = routes.find(route => route.path == path)
    root.innerHTML = route.data
}

/**
 * Function that handle the page navigation
 * @param {Event} e 
 */
const router = function (e) {
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