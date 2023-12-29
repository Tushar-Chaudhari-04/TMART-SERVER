const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { success, error } = require("../utils/responseWrapper");
//const { users } = require("../db")

const userInfoController =async (req, res) => {
    try {
        console.log(`GET request to "/user/getuserInfo" received for user`);

        if (!req._id)
            return res.send(error(400, "Token is Expired.Please login again...",""));
    
        const user=await User.findOne({_id:req._id});
        console.log("user",user)
        if(user){
            const {password,...userData}=user._doc;    
            console.log("UserData ",userData);
            return res.send(success(200,"Got the user data",userData));
        }
        
        res.send(error(500,"Error in getting User Data",err));
    } catch (err) {
        res.send(error(500,"Internal Server Error",err));
    }
}

module.exports = {
    userInfoController
};


/*
    if(users?.findOne({_id:req._id},(err,data)=>{
        console.log(data,err)
        try {
            if(data){
                const{password,...userData}=data;
              
            }    
        } catch (err) {
            return res.send(error(500,err));
        }
        }))
*/