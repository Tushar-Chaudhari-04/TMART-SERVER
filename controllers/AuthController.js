const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { success, error } = require("../utils/responseWrapper");
//const { users } = require("../db")

const registerController = async (req, res) => {
    try {
        console.log(`GET request to "/auth/register" received for user`);
        let { firstName, lastName, email, password } = req.body;

        if (!firstName && !lastName && !email && !password)
            return res.send(error(400, "All registration feilds are mandatory..."));

        const oldUser = await User.findOne({ email });
        console.log("oldUser", oldUser);

        if (oldUser)
            return res.send(error(400, "User already exists.Please use different credentials"))

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: CryptoJS.AES.encrypt(password, process.env.API_SECERT_KET).toString(),
        })

        try {
            if (newUser) {
                console.log("newUser", newUser);
                const user = await newUser.save();

                const { password, ...userData } = user._doc;

                return res.send(success(201, "User is register successfully...", userData));
            }
        } catch (err) {
            return res.send(error(500, "Error in User's Registration...", err));
        }
    } catch (err) {
        return res.send(error(500, "Internal Server Error...", err));
    }
}

const loginController = async (req, res) => {
    try {
        console.log(`GET request to "/auth/login" received for user`);
        let { email, password } = req.body;

        if (!email && !password)
            return res.send(error(400, "All login fields are mandatory...", ""));

        const existingUser = await User.findOne({ email });
        console.log("existingUser", existingUser)

        if (!existingUser)
            return res.send(error(400, "Please use valid credentials", "User is not Registered"));

        if (existingUser) {
            const decryptedData = CryptoJS.AES.decrypt(existingUser.password, process.env.API_SECERT_KET).toString(CryptoJS.enc.Utf8);

            if (decryptedData === password) {
                const jwt_token = generateJWTToken(existingUser);
                const { password, ...userDetails } = existingUser._doc;
                return res.send(success(200, "User has loggedin successfully...", { ...userDetails, jwt_token }));
            } else {
                return res.send(error(400, "Please use valid credentials", ""));
            }
        }

        return res.send(error(400, "User is not registered.Please register first", ""))
    } catch (err) {
        return res.send(500, "Internal Server Error.Please try after sometime", err);
    }
}

const generateJWTToken = (data) => {
    return jwt.sign({ id: data._id, isAdmin: data.isAdmin, email: data.email }, process.env.API_SECERT_KET, {
        expiresIn: "7d"
    });
}

module.exports = {
    registerController,
    loginController
};


/*

//Register Garbage

    if (users?.findOne({ email }, (err, data) => {
        console.log(data, err)
        if (data)
            return res.send(error(400, "User already exists.Please use different credentials"))
        else {
            console.log("password", password);
            var encryptedData = CryptoJS.AES.encrypt(password, process.env.API_SECERT_KET).toString();
            console.log("encrypt", encryptedData)
            users.insert({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: encryptedData,
                wallet_balance: 0,
                cart: [],
                address: [],
                isAdmin: false
            })
            return res.send(success(201, "User is register successfully..."));
        }
    }))

    //Login Garbage

            if (users?.findOne({ email: email }, (err, userData) => {
            if (userData) {
                const decryptedData = CryptoJS.AES.decrypt(userData.password, process.env.API_SECERT_KET).toString(CryptoJS.enc.Utf8);
                //console.log("decryptedData",decryptedData)
                if (decryptedData === password) {
                    const jwt_token = generateJWTToken(userData);
                    const { password, ...userDetails } = userData;
                    return res.send(success(200, { ...userDetails, jwt_token }));
                } else {
                    return res.send(error(400, "Please use valid credentials"));
                }
            } else {
                return res.send(error(500, "User is not registered.Please register user"))
            }
        }))
            return res.send(500, "Internal Server Error.Please try after sometime", err);
*/