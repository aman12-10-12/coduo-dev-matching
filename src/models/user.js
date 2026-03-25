const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 50
    },

    lastName : {
        type : String,
    },

    emailId : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        unique : true,
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email Address" + value)
            }

            // const allowedDomains = [
            // "gmail.com",
            // "yahoo.com",
            // "outlook.com",
            // "hotmail.com"
            // ];

            // const domain = value.split("@")[1];

            // if (!allowedDomains.includes(domain)) {
            //     throw new Error("Email provider not supported");
            // }
        }
    },

    password : {
        type : String,
        required : true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter A strong password your Password is weak" + value)
            }
        }
    },

    age : {
        type : Number,
    },

    gender : {
        type : String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender Data Is not valid it must should be [male, female, others]")
            }
        }
    },

    photoUrl : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2024/03/15/19/51/ai-generated-8635685_1280.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Incorrect image url" + value)
            }
        }
    },

    about : {
        type : String,
        default : "Write About Yourself"
    },

    skills : {
        type : [String]
        
    },
}, 
{
    timestamps : true,
})

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id }, "@AmanSamrat01!@#$1234WEBtoken", { expiresIn: "1d" })
    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid
}

module.exports = mongoose.model("User", userSchema)