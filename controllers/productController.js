const Product = require('../models/Product');
const auth = require("../auth");
const { verify, verifyAdmin, errorHandler } = auth;

// module.exports.createProduct =  async (req, res) => {
    
//     const { name, description, price, isActive, createdOn } = req.body;

//     if (!name) {
//         return res.status(400).send({ error: 'Name is required' });
//         //return errorHandler(err, req, res);
//     }

//     if (!description) {
//         return res.status(400).send({ error: 'Description is required' });
//     }

//     if (!price) {
//         return res.status(400).send({ error: 'Price is required' });
//     }

//     try {

//     const newProduct = new Product ({
//     name : name,
//     description : description,
//     price : price,
//     isActive : isActive,
//     createdOn : createdOn
//     });

//     await newProduct.save();
    
//     return res.status(200).send({message: 'Product created successfully'});

//     } catch (err) {
//         errorHandler(err, req, res);
//     }
// }

module.exports.createProduct = async (req, res) => {
    const { name, description, price, isActive, createdOn } = req.body;

    // Create a new product with the provided data
    const newProduct = new Product({
        name,
        description,
        price,
        isActive,
        createdOn
    });

    try {
        // Save the product, which will run schema validations
        const savedProduct = await newProduct.save();

        return res.status(201).send(
            savedProduct
        // {    success: true,
        //     message: 'Product created successfully',
        //     savedProduct
        // }
        );

    } catch (err) {
        // Handle validation errors and other issues
        return errorHandler(err, req, res);
    }
};

module.exports.getAllProducts =  async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).send({products : products});
    } catch (err) {
        errorHandler(err, req, res);
    }
}


module.exports.getActiveProducts =  async (req, res) => {
    try {
        const product = await Product.find({ isActive: true });
        return res.status(200).send({product : product});
    } catch (err) {
        errorHandler(err, req, res);
    }
}


module.exports.getProductById =  async (req, res) => {
    try {
        id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({error: 'Product not found'});
        }

        return res.status(200).send({product : product});

    } catch (err) {
        errorHandler(err, req, res);
    }
}



module.exports.searchByName =  async (req, res) => {
    try {
        const product = await Product.find({
            //name: { $regex: req.body.name, $options: 'i' }, //use this for wildcard search
            name: req.body.name
        })
        return res.status(200).send(product);
    } catch (err) {
        errorHandler(err, req, res);
    }
}


module.exports.searchByPrice =  async (req, res) => {
    try {

        const product = await Product.find({
            price: { $gte: req.body.minPrice, $lte: req.body.maxPrice }
        })

        if (!product) {
            return res.status(404).send({error: 'Product not found'});
        }

        return res.status(200).send(product);

    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports.updateProduct =  async (req, res) => {
    try {

        const { name, description, price } = req.body

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        name : name,
        description : description,
        price : price
        },
        { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({
                //success: false,
                message: 'Product not found'
            });
        }


        return res.status(200).send({
            success: true,
            message: 'Product updated successfully',
            products: updatedProduct
        });

    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports.activateProduct =  async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                //success: false,
                message: 'Product not found'
            });
        }

        if (product.isActive) {
            return res.status(200).send({
                //success: false,
                message: 'Product already active',
                product: product
            });
        }


        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        isActive : true
        },
        { new: true }
        );

        

        return res.status(200).send({
            success: true,
            message: 'Product activated successfully',
            activateProduct: updatedProduct
        });

    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports.archiveProduct =  async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                //success: false,
                message: 'Product not found'
            });
        }

        if (!product.isActive) {
            return res.status(200).send({
                //success: false,
                message: 'Product already archived',
                archivedProduct: product
            });
        }


        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            isActive : false
            },
            { new: true }
            );
    
    
            return res.status(200).send({
                success: true,
                message: 'Product archived successfully',
                //data: updatedProduct
            });

    } catch (err) {
        errorHandler(err, req, res);
    }
}