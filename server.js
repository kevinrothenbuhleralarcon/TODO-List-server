/* AUTHOR: Kevin Rothenbühler-Alarcon */

require ("dotenv").config()
const express = require("express")
const app = express()
const usersManagement = require("./routes/users")
const todoManagement = require("./routes/todo")
const auth = require("./middleware/auth")

// Middleware
app.use(express.json())
app.use("/static", express.static("public"))

// API
app.get("/api/todoList", auth, todoManagement.getTodoList)

app.post("/api/register", usersManagement.registerUser)
app.post("/api/login", usersManagement.loginUser)
app.post("/api/deleteUser", usersManagement.deleteUser)

// Web client entry point
app.get("/*", (req, res) => {
    res.sendFile(__dirname+"/public/index.html")
})


app.listen(process.env.PORT, () => {
    console.log("Server started")
})