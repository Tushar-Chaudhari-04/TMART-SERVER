const User = require("../models/User");
const Product = require("../models/Product");
const { success, error } = require("../utils/responseWrapper");
//const { users, products } = require("../db")

const addProductController = async (req, res) => {
    try {
     //   console.log(`POST request to "/product/addProduct" received for user`);

        for (let data in req.body) {
            const { name, qty, mrp, price, url, categoryId } = req.body[data];

            if (!req._id)
                return res.send(error(400, "Token is Expired.Please login again...", ""));

            if (req.isAdmin !== true)
                return res.send(error(400, "You are not authorised to add products", ""))

            const oldProduct = await Product.findOne({ name });

            if (oldProduct)
                return res.send(error(400, "Product already exists.Please add different product"))

            const newProduct = new Product({
                name,
                qty,
                mrp,
                price,
                url,
                categoryId
            })

            await newProduct.save();
            continue
        }
        return res.send(success(201, "Product added successfully...", ""));
    } catch (err) {
        return res.send(error(500, "Error in adding product", err));
    }
}

const getProductController = async (req, res) => {
   // console.log(`POST request to "/product/getProduct" received for user`);

    const { name } = req.body;
    try {
        if (name) {
            var product = await Product.findOne({ name });
        }
        else {
            product = await Product.find();
        }

        if (product)
            return res.send(success(200, "Got the product data...", product));
    } catch (err) {
        return res.send(error(400, "Error in getting product data", err));
    }
}

const searchProductController = async (req, res) => {
    // console.log(`POST request to "/product/getProduct" received for user`);
 
     const { searchParams } = req.query;
     console.log("query",searchParams)
     try {
         if (searchParams) {
             var product = await Product.find({
                "$or":[
                    {name:{$regex:searchParams}},
                    {categoryId:{$regex:searchParams}}
                ]
             });
         }
         else {
             product = await Product.find();
         }
 
         if (product)
             return res.send(success(200, "Search product data ...", product));
     } catch (err) {
         return res.send(error(400, "Error in searching product data", err));
     }
 }

module.exports = {
    addProductController,
    getProductController,
    searchProductController
};

