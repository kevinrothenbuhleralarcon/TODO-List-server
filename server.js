require ("dotenv").config()
const express = require("express")
const app = express()
//const connection = require("./config/database")
const usersManagement = require("./routes/users")
const todoManagement = require("./routes/todo")

// Middleware
app.use(express.json())

app.get("/", usersManagement.index)

app.listen(process.env.PORT)