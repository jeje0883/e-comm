const bcrypt = require('bcrypt');

const Cart = require("../models/Cart");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const auth = require("../auth");
const { errorHandler } = auth;

/************************************************************************************************
 
module.exports.getCart = (req, res) => {
    const { cartItems } = req.body;

   if(!cartItems || cartItems.length === 0) {
    return res.status(400).send({
        message: 'No cart items provided'
    });
   }
   
   Cart.find({cartItems})
   .then(cart => {
    if(cart.length > 0) {
        return res.status(404).send({
            message: 'No items in cart'
        });
    }
    return res.status(200).send(cart);
   })
   .catch(error => errorHandler(error, req, res))
}

module.exports.addToCart = async  (req, res) => {

    const { productId, quantity, price, subtotal } = req.body
    const userId = req.user;



    const product = await Product.findById(productId)
        if(!product) {
            return res.status(404).send({
                message: 'Product not found'
            })
        }

        let cart = await Cart.findOne({ userId });

        if(!cart) {
            cart = new Cart({
                userId,
                cartItems: []
            });
        }

        if(cart) {
            const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));
            if(itemIndex > -1){
                cart.cartItems[itemIndex].quantity += quantity;
                cart.cartItems[itemIndex].subTotal += subtotal;
            } else {
                cart.cartItems.push({
                    productId,
                    quantity,
                    subTotal: subtotal
                });
            }
        } 

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

        const savedCart = await cart.save()
        .then(cart => {
            return res.status(200).send({
                message: 'Item added to cart successfully',
                cart: savedCart
            });
        })
        .catch(error => errorHandler(error, req, res));

}

module.exports.newQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user;

    if(quantity < 1){
        return res.status(400).send({
            message: 'Quantity must be at least 1'
        });
    }

    let cart = await Cart.findOne({userId});
    if(!cart) {
        return res.status(404).send({
            message: 'Cart not found'
        });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));
    
    if(itemIndex === 1){
        return res.status(404).send({
            message: 'Product not found in cart'
        });
    }

    cart.cartItems[itemIndex].quantity = quantity;
    cart.cartItems[itemIndex.subTotal] = cart.cartItems[itemIndex].quantity * cart.cartItems[itemIndex].price;

    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

    const savedCart = await cart.save()
        .then(cart => {
            return res.status(200).send({
                message: 'Cart item quantity updated successfully',
                cart: savedCart
            });
        })
        .catch(error => errorHandler(error, req, res));
}

module.exports.removeProduct = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user;

    let cart = await Cart.findOne({userId});
    if(!cart) {
        return res.status(404).send({
            message: 'Cart not found'
        });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));
    if(itemIndex === -1){
        return res.status(404).send({
            message: 'Product not found in cart'
        });
    }

    cart.cartItems.splice(itemIndex, 1);

    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

    const savedCart = await cart.save()
        .then(cart => {
            return res.status(200).send({
                message: 'Item removed to cart successfully',
                cart: savedCart
            });
        })
        .catch(error => errorHandler(error, req, res));
}

module.exports.clearCart = async (req, res) => {



    const { userId } = req.user;

    let cart = await Cart.findOne({ userId });
    if(!cart) {
        return res.status(404).send({
            message: 'Cart not found'
        });
    }

    cart.cartItems = [];
    cart.totalPrice = 0;

    const savedCart = await cart.save()
    .then(result => {
        return res.status(200).send({
            message: 'Cart cleared successfully',
            result: savedCart
        })
    })
    .catch(error => errorHandler(error, req, res));
}

***************************************************************************/

module.exports.addToCart = async (req, res) => {
    try {
        
        if (req.user.isAdmin) {
            return res.status(403).send({message : 'Add cart is not allowed to Admin'});
        }
        
        
        const { productId, price, quantity, subtotal } = req.body;



        // Ensure valid product ID and quantity
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).send({ error: 'Invalid product ID or quantity' });
        }

        //find the user from database by finding its id
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        //fin the product from database by finding its id
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        //const subTotal = product.price * quantity;
        const subTotal = subtotal

        //find from cart database the cart linked to the current user
        let cart = await Cart.findOne({ userId: user._id });

        if (cart) {
            // If the user already has a cart, add the new item to it
            const existingItemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

            if (existingItemIndex >= 0) {
                // If the product is already in the cart, update the quantity and subtotal
                cart.cartItems[existingItemIndex].quantity += quantity;
                cart.cartItems[existingItemIndex].subTotal += subTotal;
     
            } else {
                // If the product is not in the cart, add it as a new item
                cart.cartItems.push({
                    productId: product._id,
                    quantity: quantity,
                    subTotal: subTotal
                });
            }

            // Update the total price of the cart rev
            cart.totalPrice += subTotal; 
        } else {
            // If the user does not have a cart, create a new one
            cart = new Cart({
                userId: user._id,
                cartItems: [{
                    productId: product._id,
                    quantity: quantity,
                    subTotal: subTotal
                }],
                totalPrice: subTotal

            });
        }

        //save the  cart in the database
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('cartItems.productId');

        return res.status(200).send({
            message: 'Item added to cart successfully',
            cart: populatedCart
        });

    } catch (err) {
        console.error('Error in addToCart:', err);
        return errorHandler(err, req, res);
    }
};

module.exports.removeProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Extract productId from URL parameters

        if (!productId) {
            return res.status(400).send({ error: 'Product ID is required' });
        }

        // Find the product from product database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        // Find the index of the item to be removed
        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).send({ error: 'Item not found in cart' });
        }

        // Remove the item from the cartItems array
        const itemToRemove = cart.cartItems[itemIndex];
        cart.cartItems.splice(itemIndex, 1);

        // Update the totalPrice
        cart.totalPrice -= itemToRemove.subTotal;

        // Save the updated cart
        await cart.save();

        // Return the updated cart
        return res.status(200).send({
            //success: true,
            message: 'Item removed from cart successfully',
            cart: cart
        });

    } catch (err) {
        console.error('Error in removeCartItem:', err);
        return res.status(500).send({
            success: false,
            message: 'An error occurred while removing item from cart',
            error: err.message
        });
    }
};

module.exports.newQuantity = async (req, res) => {
    try {
        const { productId, newQuantity } = req.body;
        const userId = req.user.id; // Extract userId from the authenticated user

        // Check if productId and newQuantity are provided
        if (!productId || newQuantity === undefined) {
            return res.status(400).send({ error: 'Product ID and new quantity are required' });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        // Find the index of the item in the cart
        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).send({ error: 'Item not found in cart' });
        }

        // Find the product to ensure it exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        // Update the item's quantity and subtotal
        const item = cart.cartItems[itemIndex];
        item.quantity = newQuantity;
        item.subTotal = product.price * newQuantity;

        // Update the total price of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

        // Save the updated cart
        await cart.save();

        // Return the updated cart
        return res.status(200).send({
            success: true,
            message: 'Cart item quantity updated successfully',
            cart: cart
        });

    } catch (err) {
        console.error('Error in updateCartQuantity:', err);
        return res.status(500).send({
            success: false,
            message: 'An error occurred while updating cart quantity',
            error: err.message
        });
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id; // Extract userId from the authenticated user

        // Find the user's cart
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        // Clear the cartItems array and reset totalPrice
        cart.cartItems = [];
        cart.totalPrice = 0;

        // Save the updated cart
        await cart.save();

        // Return the updated cart
        return res.status(200).send({
            //success: true,
            message: 'Cart cleared successfully',
            cart: cart
        });

    } catch (err) {
        console.error('Error in clearCart:', err);
        return res.status(500).send({
            success: false,
            message: 'An error occurred while clearing the cart',
            error: err.message
        });
    }
};

module.exports.getCart = async (req, res) => {
    try{
        const userId = req.user.id; // Extract userId from the authenticated user

        const cart = await Cart.findOne({userId : userId});

        return res.status(200).send(cart);

    } catch (err) {
        errorHandler(err, req, res);
    }
}