const mongoose = require("mongoose")
const validator = require("validator")

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

module.exports = mongoose.model("User", userSchema)