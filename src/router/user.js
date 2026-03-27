const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");


const userRouter = express.Router();

const VALID_DATA_TO_SEND = "firstName lastName age gender about photoUrl skills"

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequestData = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", VALID_DATA_TO_SEND)
        // .populate("fromUserId", ["firstName", "lastName"])

        if (!connectionRequestData || connectionRequestData.length === 0) {
            return res.json({
                message: "No connection requests",
                data: [],
            });
        }

        res.json({
            message: "Data fetched successfully",
            data: connectionRequestData,
        });

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequestData = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id, status : "accepted"},
                {fromUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId", VALID_DATA_TO_SEND).populate("toUserId", VALID_DATA_TO_SEND)

        if (!connectionRequestData || connectionRequestData.length === 0) {
            return res.json({
                message: "No connection found",
                data: [],
            });
        }

        const finalData = connectionRequestData.map((row) => {
            if(row.fromUserId.toString() === loggedInUser._id.toString())
            {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({ finalData })
        
    } catch (err) {
        res.status(400).send("ERROR : ", err.message)
    }


})

module.exports = userRouter;