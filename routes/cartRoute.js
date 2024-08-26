const express = require("express");
const passport = require("passport");
const cartController = require("../controllers/cartController");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

const router = express.Router();

router.post('/add-to-cart', verify, cartController.addToCart);

router.patch('/:id/remove-from-cart', verify, cartController.removeCartItem);

router.patch('/update-cart-quantity', verify, cartController.updateCartQuantity);

router.put('/clear-cart', verify, cartController.clearCart);

router.get('/get-cart', verify, cartController.getCart);

module.exports = router;
