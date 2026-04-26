const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    }
    catch (err) {
        console.log("error connecting to DataBase!!!");
    }
}

module.exports = connectDB