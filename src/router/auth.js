const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/user.js")
const { validateSignUpData } = require("../utils-helper/validation.js")
const { userAuth } = require("../middlewares/auth.js")

const authRouter = express.Router()

// api call for /signUp
authRouter.post("/signup", async (req, res) => {
    try {
        // Validation of data
        validateSignUpData(req);


        // Encryption/hashing the password
        const { firstName, lastName, emailId, password } = req.body

        const passwordHash = await bcrypt.hash(password, 10)
        // console.log(passwordHash)

        // storing into data base
        // creating an instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash
        })

        const savedUser = await user.save()

        // create a JWT token
        const token = await savedUser.getJWT()

        // Add the token to cookie and sends along with response back to user
        res.cookie("token", token, {expires: new Date(Date.now() + 24 * 3600000)}) // cookie expire in 24 hr

        res.json({message : "User Added Succesfully", data : savedUser})
    }
    catch (err) {
        res.status(400).send("Error occured while saving the user : " + err.message)
    }
})

//  api call for /login
authRouter.post("/login", async (req, res) => {
    
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

            res.send(user)
        }
        else {
            throw new Error("Invalid Cerendentials!!!")
        }
    }catch (err) {
        res.status(400).send("Error While login : " + err.message)
    }
})

// api call for logout
authRouter.post("/logout", userAuth , async (req, res) => {
    const user = req.user
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send(`${user.firstName} - "Logged out succesfully"`)
})

module.exports = authRouter