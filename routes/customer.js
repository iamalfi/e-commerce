const router = require("express").Router();
const customerController = require("../controller/customer");
const { Authentication } = require("../middleware/auth");
router.get("/get-products", customerController.getProducts);
router.get("/get-product/:productId", customerController.getProduct);
router.put(
    "/add-to-cart/:productId",
    Authentication,
    customerController.addToCart
);
router.put(
    "/delete-cart/:productId",
    Authentication,
    customerController.deleteCart
);
router.post("/order", Authentication, customerController.addToOrder);
// router.post("/payment", Authentication, customerController.payment);
module.exports = router;
