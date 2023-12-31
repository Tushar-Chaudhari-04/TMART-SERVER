const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { success, error } = require("../utils/responseWrapper");
const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY
});

const getRazorPayKey = async (req, res) => {
    res.send(success(200, "Razor Pay Keys", { razorPayKey: process.env.RAZOR_PAY_KEY_ID }))

    //res.send(error(400,"UnAuthorised User","Please login and continue"))
}

const createOrderController = async (req, res) => {
    try {
        const { userId, userName, grossTotal, products } = req.body;
        var options = {
            amount: Number(grossTotal * 100),  // amount in the smallest currency unit
            currency: "INR",
        };
        const orderInstance = await instance.orders.create(options);

        const newOrder = new Order({
            orderId: orderInstance.id,
            orderProducts: products,
            user: userId
        })

        const newOrderData = await newOrder.save();

        res.send(success(200, "Your's order is received...", newOrderData))
    } catch (err) {
        res.send(error(500, "Error in getting your order", err))
    }
}

const paymentVerificationController = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const generated_signature = crypto.createHmac('sha256', process.env.RAZOR_PAY_SECRET_KEY)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = generated_signature === razorpay_signature;
       
        if (isAuthentic) {
            //DB Works
            const payment = new Payment({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature
            })
            await payment.save();
            res.redirect(`${process.env.CLIENT_LOCALHOST_BASE_URL}/payment/success?referenceNumber=${razorpay_payment_id}`);
        }

        else
            res.redirect(`${process.env.CLIENT_LOCALHOST_BASE_URL}/payment/error?referenceNumber=${razorpay_payment_id}`)
    } catch (err) {
        return res.send(error(500, "Internal Server Error", err));
    }
}

module.exports = {
    getRazorPayKey,
    createOrderController,
    paymentVerificationController
}