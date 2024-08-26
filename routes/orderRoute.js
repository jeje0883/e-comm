const express = require("express");
const passport = require("passport");
const orderController = require("../controllers/orderController");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

const router = express.Router();

router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);

router.get('/my-orders', verify, orderController.getMyOrders);

router.post('./checkout', verify, orderController.checkout);

router.post('/create-order', verify, orderController.createOrder);

module.exports = router;
