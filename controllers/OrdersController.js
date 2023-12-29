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
        console.log("req", req.body);
        const { userId, userName, grossTotal, products } = req.body;
        var options = {
            amount: Number(grossTotal * 100),  // amount in the smallest currency unit
            currency: "INR",
        };
        const orderInstance = await instance.orders.create(options);

        console.log("orderInstance", orderInstance)

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
        console.log("req.body",req.body)
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        console.log("body",body)
        const generated_signature = crypto.createHmac('sha256', process.env.RAZOR_PAY_SECRET_KEY)
            .update(body.toString())
            .digest('hex');
            console.log("generated_signature",generated_signature)
        const isAuthentic = generated_signature === razorpay_signature;
       
        console.log("isAuthentic",isAuthentic);
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

/*
Payment Garbage 

 // "razorpay_payment_id": "pay_NHpS34V3nNZE7s",
        // "razorpay_order_id": "order_NHpRk3qwIukc2j",
        // "razorpay_signature": "a5745cfbf06ffc1779d48ff6194ba6e1ac870c119fe435fd0d69fba3e09b1456"

 // const lineItems = await Promise.all(products.map(async (product) => {
        //     const image = product.url
        //     const realProduct = await Product.findOne({
        //         name: product.name
        //     });

        //     console.log("realProduct", realProduct)
        //     return {
        //         user_data:{
        //             userId,
        //             userName
        //         },
        //         product_data: {
        //             name: realProduct.name,
        //             images:realProduct.url
        //         },
        //         price_data: {
        //             currency: "inr",
        //             unit_amount: Number(realProduct.price * 100)      //realProduct to validate pricing of products
        //         },
        //         quantity: product.productQty,
        //         categoryId: product.categoryId,
        //     }
        // }))

        //console.log("lineItems",lineItems);

 // try {
        //     console.log("req",req.body.products);
        //     const productData=req.body.products;
        //     console.log("products",productData)

        //     const userDetails=await users?.findOne({_id:req.body.user},(err,userData)=>{
        //       if(!userData)
        //         res.send(error(500,"User not exists...")) 
        //         console.log("userData",userData);
        //       return userData;
        //     }); 

        //     console.log("userDetails",userDetails)

        //     // const lineItems=await Promise.all(products?.map(async (product)=>{
        //     //   const image = product.url
        //     //   const productEntries=await Product.findOne({
        //     //         name:product.name
        //     //   });
        //     //   console.log("productEntries",productEntries);
        //     //   const realProduct=productEntries;
        //     //   console.log("realProduct",realProduct)
        //     //   return{
        //     //     price_data:{
        //     //       currency:"inr",
        //     //       product_data:{
        //     //         name:realProduct.name,
        //     //         images:[realProduct.url]
        //     //       },
        //     //       unit_amount:realProduct.price*100      //realProduct to validate pricing of products
        //     //     },
        //     //     quantity:1
        //     //   }
        //     // }))
            
        //   //  console.log("lineItems",lineItems)
        //   const modifiedProducts=productData?.map(product=>{
        //     console.log("product 32123",product)
        //     return {
        //       price_data:{
        //         currency:"inr",
        //         product_data:{
        //           name:product.name,
        //           images:product.url
        //         },
        //         unit_amount:product.price*100      //realProduct to validate pricing of products
        //       },
        //       quantity:product.productQty
        //     }
        //   })
        //   console.log("modifiedProducts",modifiedProducts)
        //     const session = await stripe.checkout.sessions.create({
        //       shipping_address_collection: {
        //         allowed_countries: ['IN'],
        //       },
        //       line_items:[
        //         {
        //           price_data:{
        //             currency:"inr",
        //             product_data:{
        //               name:productData.name,
        //               images:[productData.url]
        //             },
        //             unit_amount:productData.price*100      //realProduct to validate pricing of products
        //           },
        //           quantity:productData.productQty
        //         }
        //       ],
        //       mode: 'payment',
        //       success_url: `${process.env.CLIENT_BASE_URL}/payments/success`,
        //       cancel_url: `${process.env.CLIENT_BASE_URL}/payments/failure`,
        //     });
      
        //     console.log("session",session)

        //     orders.insert({
        //       stripeId:session.id,
        //       products:lineItems
        //     });
        //     //console.log("orderData",orderData)
        //     res.send(success(200,{stripeId:session.id}));
        // } catch (err) {
        //     console.log("Error in Payment...",err);
        //     res.send(error(500,err));
        //   }
*/