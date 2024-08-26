const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        },
        subTotal: {
            type: Number, 
            required: true}
    }],
    totalPrice: {
        type: Number,
        default : 0
    },
    OrderedOn: {
        type: Date,
        default: Date.now
    }
});

cartSchema.pre('save', function(next) {
    if (this.cartItems.length > 0) {
        this.totalPrice = this.cartItems.reduce((total, item) => total + item.subTotal, 0);
    } else {
        this.totalPrice = 0;
    }
    next();
});



module.exports = mongoose.model('Cart', cartSchema);