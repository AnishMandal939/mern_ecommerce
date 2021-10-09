const express = require("express");
const {getAllProducts, createProduct,updateProduct, deleteProduct, getProductDetails} = require("../controllers/productController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")

const router= express.Router();


// create route
router.route("/products").get( getAllProducts);
router.route("/product/new").post( isAuthenticatedUser,authorizeRoles("admin"),  createProduct);
router.route("/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct);
router.route("/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),  deleteProduct);
router.route("/product/:id").get(getProductDetails);
// or for update and delete both have same method so can be done like
// router.route("/product/:id").put(updateProduct).delete(deleteProduct);



module.exports = router;