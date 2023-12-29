const mongoose=require("mongoose");

const productSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        qty:{
            type:String,
            required:true,
        },
        mrp:{
            type:Number,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
        categoryId:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:true
    }
)

module.exports=mongoose.model("produict",productSchema);