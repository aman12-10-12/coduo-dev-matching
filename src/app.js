const express = require('express')
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const connectDb = require("./config/database.js")
const User = require("./models/user.js")
const { validateSignUpData } = require("./utils-helper/validation.js")
const { userAuth } = require("./middlewares/auth.js")

// creating an instance of express
const app = express()

app.use(express.json())
app.use(cookieParser())

// api call for /signUp
app.post("/signup", async (req, res) => {
    try {
        // Validation of data
        validateSignUpData(req);


        // Encryption/hashing the password
        const { firstName, lastName, emailId, password } = req.body

        const passwordHash = await bcrypt.hash(password, 10)
        // console.log(passwordHash)

        // storing into data base
        // creting an instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash
        })

    
        await user.save()
        res.send("Data Saved Succesfully")
    }
    catch (err) {
        res.status(400).send("Error occured while saving the user : " + err.message)
    }
})

//  api call for /login
app.post("/login", async (req, res) => {
    
    try {
        const { emailId, password} = req.body
        const user = await User.findOne({ emailId : emailId})

        if(!user) {
            throw new Error("Invalid Cerendentials!!")
        }

        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){

            // create a JWT token
            const token = await user.getJWT()

            // Add the token to cookie and sends along with response back to user
            res.cookie("token", token, {expires: new Date(Date.now() + 24 * 3600000)}) // cookie expire in 24 hr

            res.send("Log in Successfull")
        }
        else {
            throw new Error("Invalid Cerendentials!!!")
        }
    }catch (err) {
        res.status(400).send("Error While login : " + err.message)
    }
})

// /profile
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("Error While login : " + err.message)
    }
})

app.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user
    console.log("Sending Connection Request")
    res.send(`${ user.firstName } Sents COnnection Request`)
})


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
