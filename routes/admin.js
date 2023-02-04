const router = require("express").Router();
const adminController = require("../controller/admin");
const { Authorization, Authentication } = require("../middleware/auth");
router.post(
    "/product",
    Authentication,
    Authorization,
    adminController.createProduct
);
router.get(
    "/getproducts",
    Authentication,
    Authorization,
    adminController.getProducts
);
router.put(
    "/updateproduct/:productId",
    Authentication,
    Authorization,
    adminController.updateproduct
);
router.delete(
    "/deleteproduct/:productId",
    Authentication,
    Authorization,
    adminController.deleteproduct
);
module.exports = router;
