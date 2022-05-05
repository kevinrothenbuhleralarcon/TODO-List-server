/* AUTHOR: Kevin Rothenbühler-Alarcon */

require ("dotenv").config()
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const usersManagement = require("./routes/users")
const todoManagement = require("./routes/todos")
const auth = require("./middleware/auth")
const validateTodo = require("./middleware/validateTodo")
const https = require("https")
const fs = require("fs")

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use("/static", express.static("public"))

// API

// User
app.get("/api/user", auth, usersManagement.getUser)
app.post("/api/register", usersManagement.registerUser)
app.post("/api/login", usersManagement.loginUser)
app.post("/api/disconnect", auth, usersManagement.disconnectUser)
app.put("/api/updateUser", auth, usersManagement.updateUser)
app.delete("/api/deleteUser", auth, usersManagement.deleteUser)


// Todo
app.get("/api/todoList", auth, todoManagement.getTodoList)
app.get("/api/todo", auth, todoManagement.getTodo)
app.post("/api/add", auth, validateTodo.validateAddTodo, todoManagement.addTodo)
app.put("/api/update", auth, validateTodo.validateUpdateTodo, todoManagement.updateTodo)
app.delete("/api/delete", auth, todoManagement.deleteTodo)


// Web client entry point
app.get("/*", (req, res) => {
    res.sendFile(__dirname+"/public/index.html")
})


app.listen(process.env.PORT || 5000, () => {
    console.log("Server started")
})
/*https
    .createServer(
        {
            key: fs.readFileSync("key.pem"),
            cert: fs.readFileSync("cert.pem")
        },
        app
        )
    .listen(process.env.PORT, () => {
        console.log("Server started")
    })*/