const express = require("express")
const { userAuth } = require("../middlewares/auth.js")
const ConnectionRequest = require("../models/connectionRequest.js")
const { validateSendRequest, validateReviewRequest } = require("../utils-helper/validation.js")


const requestRouter = express.Router()

const sendEmail = require("../utils-helper/sendEmail.js")

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

        try {
            const emailResponse = await sendEmail.run(
                "You have a new connection request from " + req.user.firstName + " " + req.user.lastName,
                req.user.firstName + " is interested in connecting with you on Coduo. Please log in to your account to review the request."
            );
            // console.log("Email Response: ", emailResponse);
        } catch (emailErr) {
            console.error("Email failed to send:", emailErr.message);
        }

        res.json({
            message: "Connection request sent successfully",
            data,
        })

    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})
requestRouter.post("/request/review/:status/:requestedId",userAuth, async (req, res) => {
        try {
            // calling validation
            validateReviewRequest(req.params);

            const loggedInUser = req.user;
            const { status, requestedId } = req.params;

            const updatedConnectionRequest = await ConnectionRequest.findOne({
                _id: requestedId,
                toUserId: loggedInUser._id,
                status: "interested"
            });

            if (!updatedConnectionRequest) {
                throw new Error("Connection Request not Found");
            }

            updatedConnectionRequest.status = status;

            const data = await updatedConnectionRequest.save();

            res.json({
                message: "Connection Request " + status,
                data,
            });

        } catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
    }
);

module.exports = requestRouter
