const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        orderProducts: {
            type: JSON,
            requried: true,
        },
        user: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }]
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("orders", orderSchema);