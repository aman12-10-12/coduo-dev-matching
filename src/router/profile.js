const express = require("express")
const { userAuth } = require("../middlewares/auth.js")
const { validateEditProfileData } = require("../utils-helper/validation.js")

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

module.exports = profileRouter