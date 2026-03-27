const mongoose = require("mongoose")
const User = require("../models/user.js");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User", // reference to user collection
        required : true
    },

    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    status : {
        type : String,
        required : true,
        enum : {
            values : ["interested", "ignored", "accepted", "rejected"],
            message : `{VALUE} is incorrect status type`
        },
    },
}, 
{ timestamps : true},
)

connectionRequestSchema.pre("save", async function (next) {
    const connectionRequest = this
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send request to yourself");
    }
});

connectionRequestSchema.index({fromUserId : 1, toUserId : 1})

const connectionRequestModel = mongoose.model("connectionRequestModel" , connectionRequestSchema)
module.exports = connectionRequestModel