const express = require('express')
const cookieParser = require("cookie-parser")
const connectDb = require("./config/database.js")
const cors = require("cors")

// router
const authRouter = require("./router/auth.js")
const profileRouter = require("./router/profile.js")
const requestRouter = require("./router/request.js")
const userRouter = require("./router/user.js")

// creating an instance of express
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
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
        app.listen(7777, () => {
            console.log("Server is succesfully listening on port 7777")
        })
    })
    .catch((err) => {
        console.error("DataBase can not be conneccted")
    })
