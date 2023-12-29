const router = require('express').Router();
const userController=require("../controllers/UserController");
const {verifyToken}=require("../middlewares/verifyToken");

router.get("/getUserInfo",verifyToken,userController.userInfoController);

module.exports = router;