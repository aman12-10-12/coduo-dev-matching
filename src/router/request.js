const express = require("express")
const { userAuth } = require("../middlewares/auth.js")

const requestRouter = express.Router()

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user
    console.log("Sending Connection Request")
    res.send(`${ user.firstName } Sents COnnection Request`)
})

module.exports = requestRouter
