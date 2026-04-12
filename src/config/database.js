const mongoose = require("mongoose")

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://aman_raj:OJCM4QamMpNJmM4F@mycluster.6uu3821.mongodb.net/CoDuo")
}

module.exports = connectDb
