/* AUTHOR: Kevin Rothenbühler-Alarcon */

/** Class representing a User */
export default class User {

    /**
     * Constructor
     * @param {String} username
     * @param {String} email
     * @param {String} oldPassword
     * @param {String} newPassword
     */
     constructor(
        username = null,
        email = null,
        oldPassword = null,
        newPassword = null
    ) {
        this.username = username
        this.email = email
        this.oldPassword = oldPassword
        this.newPassword = newPassword
    }

    static fromApi(userJson) {
        return new User(
            userJson.username,
            userJson.email,
            null,
            null
        )
    }
}