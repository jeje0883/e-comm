const express = require("express");
const passport = require("passport");
const cartController = require("../controllers/cartController");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

const router = express.Router();

router.get('/get-cart', verify, cartController.getCart);

router.post('/add-to-cart', verify, cartController.addToCart);

router.patch('/update-cart-quantity', verify, cartController.newQuantity);

router.patch('/:id/remove-from-cart', verify, cartController.removeProduct);

router.put('/clear-cart', verify, cartController.clearCart);



module.exports = router;