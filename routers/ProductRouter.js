const router = require('express').Router();
const productController=require("../controllers/ProductController");
const {verifyToken}=require("../middlewares/verifyToken");

router.post("/addProduct",verifyToken,productController.addProductController)
router.post("/getProduct",productController.getProductController);
module.exports = router;