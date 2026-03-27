const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
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

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this
    // checking that fromUserId is not same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to yourself")
    }
    // this will work exactly same as above code
    //   if (fromUserId.toString() === toUserId) {
            // throw new Error("Cannot send request to yourself");
    //  }
    next()
})

connectionRequestSchema.index({fromUserId : 1, toUserId : 1})

const connectionRequestModel = mongoose.model("connectionRequestModel" , connectionRequestSchema)
module.exports = connectionRequestModel