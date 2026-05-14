require('dotenv').config()
const express = require('express')
const cookieParser = require("cookie-parser")
const connectDb = require("./src/config/database.js")
const cors = require("cors")

// router
const authRouter = require("./src/router/auth.js")
const profileRouter = require("./src/router/profile.js")
const requestRouter = require("./src/router/request.js")
const userRouter = require("./src/router/user.js")

// creating an instance of express
const app = express()

require('./src/utils-helper/cronJob') 

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}))

// app.options("*", cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


connectDb()
    .then(() => {
        console.log("DataBase connection Established")
        app.listen(process.env.PORT, () => {
            console.log("Server is succesfully listening on port 7777")
        })
    })
    .catch((err) => {
        console.error("DataBase can not be conneccted")
    })
