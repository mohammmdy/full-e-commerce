const slugify = require('slugify')
const asyncHandler = require('express-async-handler');
const productModel = require('../models/productModel')
const { uploadMultiImage, resizeImage } = require('../middlewares/uploadImageMiddleware')

const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeature');
const handlerFactory = require('./handlersFactory')


exports.uploadmultiImages = uploadMultiImage('imageCover', 'images')


exports.resize = resizeImage

exports.createproduct = handlerFactory.createOne(productModel)

exports.getAllProducts = handlerFactory.getAll(productModel, 'product')

exports.getProduct = handlerFactory.getOne(productModel, 'reviews')

exports.updateProduct = handlerFactory.updateOne(productModel)

exports.deleteProduct = handlerFactory.deleteOne(productModel)