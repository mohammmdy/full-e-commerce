const express = require('express');

const { createproduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    uploadmultiImages,
    resize
} = require('../services/productService')

const { createProductValidator,
    updateProductValidator,
    deleteProductValidator,
    getProductValidator
} = require('../utils/validators/productValidation')


const {
    protect,
    allowedTo
} = require('../services/authService')


const reviewRoute = require('./reviewRoute')

const router = express.Router()

router.use('/:productId/reviews', reviewRoute)

router.route('/').post(protect, allowedTo('admin', 'manager'), uploadmultiImages, resize, createProductValidator, createproduct).get(getAllProducts)
router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(protect, allowedTo('admin', 'manager'), uploadmultiImages, resize, updateProductValidator, updateProduct)
    .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct)

module.exports = router;