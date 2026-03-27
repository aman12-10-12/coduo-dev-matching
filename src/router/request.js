const express = require("express")
const { userAuth } = require("../middlewares/auth.js")
const ConnectionRequest = require("../models/connectionRequest.js")
const { validateSendRequest } = require("../utils-helper/validation.js")


const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        await validateSendRequest({
            fromUserId,
            toUserId,
            status,
            ConnectionRequest
        });

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save()

        res.json({
            message: "Connection request sent successfully",
            data,
        })

    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = requestRouter
