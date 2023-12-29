const router=require("express").Router();
const orderController=require("../controllers/OrdersController");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/getRazorPayKey",verifyToken,orderController.getRazorPayKey);
router.post("/createOrder",verifyToken,orderController.createOrderController);
router.post("/paymentVerification",orderController.paymentVerificationController);



module.exports=router;