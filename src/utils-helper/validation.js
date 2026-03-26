const validator = require("validator")

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

module.exports = {
    validateSignUpData,
    validateEditProfileData,
}