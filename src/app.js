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

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(isPasswordValid){

            // create a JWT token
            const token = await jwt.sign({_id : user._id}, "@AmanSamrat01!@#$1234WEBtoken")

            // Add the token to cookie and sends along with response back to user
            res.cookie("token", token)

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

//  GET user by emailId
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId

    try {
        const user = await User.find({ emailId : userEmail})
        if (user.length === 0) {
            res.status(402).send("User Not Found")
        }
        else {
            res.send(user)
        }
    }
    catch(err)
    {
        res.status(400).send("Error Occured While fetching : " + err.message)
    }
})

// Feed API - get all user
app.get("/feed", async (req, res) => {

    try {
        const user = await User.find({})
        if (user.length === 0) {
            res.status(402).send("User Not Found")
        }
        else {
            res.send(user)
        }
    }
    catch(err)
    {
        res.status(400).send("Error Occured While fetching : " + err.message)
    }
})

//  deleting user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    console.log(userId)
    try {
        // const user = await User.findOneAndDelete({ _id : userId}) // {This and below code work as same but diffrence is only in syntax the below one is shorthand for this}
        const user = await User.findByIdAndDelete(userId)
        res.send("User Deleted Successfully")
    }
    catch(err)
    {
        res.status(400).send("Error Occured While fetching : " + err.message)
    }
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



// // Now we are creating a server and listen to a port
//     // we can also pass a callback function in .listen() this callback function only be called when my server once up and running
//     app.listen(7777, () => {
//         console.log("Server is succesfully listening on port 7777")
// })