const express = require('express');
const productController = require("../controllers/productController");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

const router = express.Router();

function logger(req, res, next) {
    console.log('Printing from productRouter');
    next();
}

router.post('/', verify, verifyAdmin, productController.createProduct); //needs verify and verifyAdmin

router.get('/all', verify, verifyAdmin, productController.getAllProducts); //needs verify and verifyAdmin

router.get('/active', productController.getActiveProducts); //no verfication required

router.get('/:id', productController.getProductById); //no verfication required

router.post('/search-by-name', productController.searchByName); //no verfication required

router.post('/search-by-price', productController.searchByPrice); //no verfication required

router.patch('/:id/update', verify, verifyAdmin, productController.updateProduct); //needs verify and verifyAdmin

router.patch('/:id/activate', verify, verifyAdmin, productController.activateProduct); //needs verify and verifyAdmin

router.patch('/:id/archive', verify, verifyAdmin, productController.archiveProduct); //needs verify and verifyAdmin




module.exports = router;
