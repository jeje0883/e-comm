const bcrypt = require('bcrypt');

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const auth = require("../auth");
const { errorHandler } = auth;

module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).send({orders: orders});
    } catch (error) {
        errorHandler(error, req, res);
    }
}

module.exports.getMyOrders = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);

        const userOrders = await Order.find({ userId : user}).populate('productsOrdered.productId');
        return res.status(200).send({
            success: true,
            orders: userOrders
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
}


module.exports.checkout = async (req, res) => {
    try{

    } catch (error) {
        errorHandler(error, req, res);
    }
}


module.exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming userId is stored in req.userId after authentication

        const { productsOrdered } = req.body;

        if (!productsOrdered || productsOrdered.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'No products in order'
            });
        }

        let totalPrice = 0;

        // Calculate total price and ensure all products exist
        for (let item of productsOrdered) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: `Product with ID ${item.productId} not found`
                });
            }

            item.subtotal = product.price * item.quantity;
            totalPrice += item.subtotal;
        }

        // Create new order
        const newOrder = new Order({
            userId: userId,
            productsOrdered: productsOrdered,
            totalPrice: totalPrice
        });

        // Save order to database
        const savedOrder = await newOrder.save();

        return res.status(201).send({
            success: true,
            message: 'Order created successfully',
            order: savedOrder
        });

    } catch (err) {
        // Handle any errors
        return res.status(500).send({
            success: false,
            message: 'An error occurred while creating the order',
            error: err.message
        });
    }
};

