const mysql = require("mysql2")
const dotenv = require("dotenv")
const dbURI = dotenv.parse(process.env.MYSQL_URI)

const connection = mysql.createConnection(dbURI)

connection.connect(err => {
    if (err) {
        console.log(`DB connection error: ${err.stack}`)
        return
    }

    console.log("Connected to DB")
})

module.exports = connection