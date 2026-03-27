const mongoose = require("mongoose")
const validator = require("validator")
const User = require("../models/user.js")


const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if(!firstName || !lastName){
        throw new Error("Please Enter a Valid Name")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid email address")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please Enter a Strong Password")
    }
}

const validateEditProfileData = (req) => {
    const allowedFieldEdits = ["firstName", "lastName", "emailId", "age", "gender", "about", "skills", "photoUrl"]

    const isEditAllowed = Object.keys(req.body).every(field =>
        allowedFieldEdits.includes(field)
    )

    return isEditAllowed
}

const validateResetPassword = (req) => {
    const { newPassword, confirmPassword } = req.body
    
    if (!newPassword || !confirmPassword) {
        throw new Error("Password and Confirm Password are required")
    }
    if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match")
    }
    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Please Enter a Strong Password")
    }
}

const validateSendRequest = async ({
  fromUserId,
  toUserId,
  status,
  ConnectionRequest
}) => {

  if (!["interested", "ignored"].includes(status)) {
    throw new Error("Invalid status");
  }

  if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    throw new Error("Invalid User ID");
  }

  const toUser = await User.findById(toUserId)
  if(!toUser) {
    throw new Error("User not found")
  }
//  this condition is written in Schema.pre in connectionRequest.js
//   if (fromUserId.toString() === toUserId) {
//     throw new Error("Cannot send request to yourself");
//   }

  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId }
    ]
  });

  if (existingRequest) {
    throw new Error("Connection request already exists");
  }
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validateResetPassword,
    validateSendRequest,
}