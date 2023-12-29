const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("payment", paymentSchema)