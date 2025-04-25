const mongoose = require("mongoose")
const cashRegisterStatusSchema = new mongoose.Schema({
    action: {
        type: String,
        enum: ['Expense', 'Income'],
    },
    sumPerAction:{type:Number},
    currentSum: { type: Number }
}, { timestamps: true })
module.exports = mongoose.model("Cash_Register_Status", cashRegisterStatusSchema)