const jwt = require("jsonwebtoken");
const { success, error } = require("../utils/responseWrapper");

const verifyToken = (req, res, next) => {
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith === "Bearer")
        return res.send(error(500, "User is not Authorised"));
    try {
      const tokenStr = req.headers.authorization.split(" ")[1].toString();
      const jwt_token = tokenStr.replace(/"([^"]+(?="))"/g, '$1');

        const tokenData = jwt.verify(
            jwt_token,
            process.env.API_SECERT_KET);

        if (tokenData) {
            req._id = tokenData.id;
            req.isAdmin=tokenData.isAdmin;
            req.email=tokenData.email;
            next();
        }
    } catch (err) {
        console.log("Error in Autorisation", err);
        res.send(error(500, err));
    }
}

module.exports = {
    verifyToken
}