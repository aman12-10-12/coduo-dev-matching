const mongoose = require("mongoose")

const connectDb = async () => {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
}

module.exports = connectDb
