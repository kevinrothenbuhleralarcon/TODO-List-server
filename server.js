require ("dotenv").config()
const express = require("express")
const app = express()
//const connection = require("./config/database")
const usersManagement = require("./routes/users")
const todoManagement = require("./routes/todo")

// Middleware
app.use(express.json())

app.post("/register", usersManagement.registerUser)
app.post("/deleteUser", usersManagement.deleteUser)

app.listen(process.env.PORT, () => {
    console.log("Server started")
})