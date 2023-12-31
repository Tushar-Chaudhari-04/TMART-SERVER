const express=require("express");
const cors=require("cors");
const dotenv=require('dotenv').config();
const dbConnection=require("./dbConnect");
const Razorpay = require('razorpay');

//MongoDB Database Connection 
dbConnection();

let origin=process.env.CLIENT_LOCALHOST_BASE_URL

if(process.env.NODE_ENV==='production'){
    origin=process.env.CLIENT_BASE_URL
}

//Backend App using Express
const app=express();

//Backend Routers
const authRouter=require("./routers/AuthRouter");
const userRouter=require("./routers/UserRouter");
const productRouter=require("./routers/ProductRouter")
const orderRouter=require("./routers/OrdersRouter");
const { success } = require("./utils/responseWrapper");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Backend App using Routers
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/product',productRouter)
app.use('/api/v1/order',orderRouter);

const port=process.env.PORT;

app.listen(port || 8081,()=>{
    console.log(`Tushar SuperMart server is running on port ${port}`);
});

app.get("/",(req,res)=>{
    res.send(success(200,`Welcome to TSM Server ${port}`,""))
})
