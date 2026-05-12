const User = require("../models/user.js")
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies
        if(!token) {
            return res.status(401).send("Please Login !!")
        }

        const decodeObj = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        const { _id } = decodeObj

        const user = await User.findById(_id)
        if(!user) {
            throw new Error("User Not Found")
        }

        req.user = user
        next()
    }
    catch(err) {
        res.status(401).send("ERROR : " + err.message)
    }

}

const userPasswordAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies
        if(!token) {
            throw new Error("Unauthorized(_token_)!!!")
        }

        const decodeObj = await jwt.verify(token, process.env.JWT_SECRET_KEY_FOR_RESET_PASSWORD)
        
        const { _id } = decodeObj

        const user = await User.findById(_id)
        if(!user) {
            throw new Error("User Not Found")
        }

        req.user = user
        next()

    }
    catch(err) {
        res.status(401).send("ERROR : " + err.message)
    }
}



module.exports = {
    userAuth,
    userPasswordAuth,
}
