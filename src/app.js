const express = require('express')
const cookieParser = require("cookie-parser")
const connectDb = require("./config/database.js")
const User = require("./models/user.js")
const { userAuth } = require("./middlewares/auth.js")

// router
const authRouter = require("./router/auth.js")
const profileRouter = require("./router/profile.js")
const requestRouter = require("./router/request.js")

// creating an instance of express
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)


connectDb()
    .then(() => {
        console.log("DataBase connection Established")
        app.listen(7777, () => {
            console.log("Server is succesfully listening on port 7777")
        })
    })
    .catch((err) => {
        console.error("DataBase can not be conneccted")
    })
