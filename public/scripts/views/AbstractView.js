/* AUTHOR: Kevin Rothenbühler-Alarcon */

/**
 * This callback type is called `navigate` and is displayed as a global symbol.
 *
 * @callback navigateCallback
 * @param {string} path
 */
export default class AbstractView {
     /**
     * Construct, get the title of the document in paramater
     * @param {String} title 
     */
    constructor(title) {
        document.title = title
    }    

    /**
     * Return the html content of the page
     * @returns {String} html content
     */
    async getHtml() {
        return ""
    }

    /**
     * The script for the view, takes the callback for navigation
     * @param {navigateCallback} navigateCb - The callback for navigation
     */
    async executeViewScript(navigateCb) {}

}