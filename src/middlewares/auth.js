const User = require("../models/user.js")
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies
        if(!token) {
            throw new Error("Token is not Valid!!!")
        }

        const decodeObj = await jwt.verify(token, "@AmanSamrat01!@#$1234WEBtoken")
        
        const { _id } = decodeObj

        const user = await User.findById(_id)
        if(!user) {
            throw new Error("User Not Found")
        }

        req.user = user
        next()

    }
    catch(err) {
        res.status(400).send("ERROR : " + err.message)
    }

}

module.exports = {
    userAuth
}
