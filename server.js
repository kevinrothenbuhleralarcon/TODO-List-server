/* AUTHOR: Kevin Rothenbühler-Alarcon */

require ("dotenv").config()
const express = require("express")
const app = express()
const usersManagement = require("./routes/users")
const todoManagement = require("./routes/todo")
const auth = require("./middleware/auth")

// Middleware
app.use(express.json())

app.post("/register", usersManagement.registerUser)
app.post("/login", usersManagement.loginUser)
app.post("/deleteUser", usersManagement.deleteUser)

app.get("/todoList", auth, todoManagement.getTodoList)

app.listen(process.env.PORT, () => {
    console.log("Server started")
})