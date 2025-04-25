const mongoose = require("mongoose")
const User = require("../models/User")
const studentScholarshipSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    date: {type: Date},
    numHours: { type: Number },
    sumMoney: { type: Number }
}, { timestamps: true })

module.exports = mongoose.model("StudentScholarship", studentScholarshipSchema)