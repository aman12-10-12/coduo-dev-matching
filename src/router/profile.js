const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/user.js")
const { userAuth, userPasswordAuth } = require("../middlewares/auth.js")
const { validateEditProfileData, validateResetPassword } = require("../utils-helper/validation.js")

const profileRouter = express.Router()

// profile/view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("Error While login : " + err.message)
    }
})

// api for updating profile /profile/edit
profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid edit Request")
        }

        const loggedInUser = req.user

        await Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

        loggedInUser.save()

        res.json({message : `${loggedInUser.firstName} - Your profile successfully updated`, data : loggedInUser})
    }
    catch (err) {
        res.status(400).send("Error While Editing : " + err.message)
    }
})

profileRouter.post("/profile/forgot-password", async (req,res) => {
    
    try {
        const { emailId } = req.body

        if(!emailId) {
            throw new Error("Email id required")
        }

        const user = await  User.findOne({ emailId : emailId})

        if(!user) {
            throw new Error("User doesn't exist ! please give the correct email")
        }

        const tokenForNewPassword = await user.getJWTForNewPassword()

        res.cookie("token", tokenForNewPassword, {expires: new Date(Date.now() + 20 * 60 * 1000)})
        
        res.json({ message : `Token sends to user with email : ${user.emailId} and name : ${user.firstName}`})
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

profileRouter.patch("/profile/reset-password", userPasswordAuth, async (req, res) => {
    try {
        validateResetPassword(req)

        const { newPassword } = req.body
        const user = req.user
        const passwordHash = await bcrypt.hash(newPassword, 10)
        user.password = passwordHash
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })
        await user.save()
        res.send("Password change succesfull")
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})



module.exports = profileRouter