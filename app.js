require('dotenv').config()
const express = require('express')
const cookieParser = require("cookie-parser")
const connectDb = require("./src/config/database.js")
const cors = require("cors")
const http = require("http")

// router
const authRouter = require("./src/router/auth.js")
const profileRouter = require("./src/router/profile.js")
const requestRouter = require("./src/router/request.js")
const userRouter = require("./src/router/user.js")
const initializeSocket = require("./src/utils-helper/socket.js")
const chatRouter = require("./src/router/chat.js")

// creating an instance of express
const app = express()

require('./src/utils-helper/cronJob') 

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}))

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)


const server = http.createServer(app)
initializeSocket(server);

connectDb()
    .then(() => {
        console.log("DataBase connection Established")
        server.listen(process.env.PORT, () => {
            console.log("Server is succesfully listening on port 7777")
        })
    })
    .catch((err) => {
        console.error("DataBase can not be conneccted")
    })
