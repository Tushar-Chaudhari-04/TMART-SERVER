const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { success, error } = require("../utils/responseWrapper");
//const { users } = require("../db")

const registerController = async (req, res) => {
    try {
     //   console.log(`GET request to "/auth/register" received for user`);
        let { firstName, lastName, email, password } = req.body;

        if (!firstName && !lastName && !email && !password)
            return res.send(error(400, "All registration feilds are mandatory..."));

        const oldUser = await User.findOne({ email });

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
     //   console.log(`GET request to "/auth/login" received for user`);
        let { email, password } = req.body;

        if (!email && !password)
            return res.send(error(400, "All login fields are mandatory...", ""));

        const existingUser = await User.findOne({ email });

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
