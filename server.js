/* AUTHOR: Kevin Rothenbühler-Alarcon */

require ("dotenv").config()
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const usersManagement = require("./routes/users")
const todoManagement = require("./routes/todos")
const auth = require("./middleware/auth")
const validateTodo = require("./middleware/validateTodo")

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use("/static", express.static("public"))

// API
app.get("/api/todoList", auth, todoManagement.getTodoList)
app.get("/api/todo", auth, todoManagement.getTodo)

app.post("/api/register", usersManagement.registerUser)
app.post("/api/login", usersManagement.loginUser)
app.post("/api/deleteUser", auth, usersManagement.deleteUser)
app.post("/api/disconnect", auth, usersManagement.disconnectUser)
app.post("/api/add", auth, validateTodo.validateAddTodo, todoManagement.addTodo)


// Web client entry point
app.get("/*", (req, res) => {
    res.sendFile(__dirname+"/public/index.html")
})


app.listen(process.env.PORT, () => {
    console.log("Server started")
})