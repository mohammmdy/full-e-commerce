const asyncHandler = require('express-async-handler');
const reviewModel = require('../models/reviewModel')
const handlerFactory = require('./handlersFactory')






exports.filterProduct = asyncHandler((req, res, next) => {
    let filter = {}
    if (req.params.productId) {
        filter = { product: req.params.productId }
    }
    req.filterObj = filter
    next()
})
exports.getReviews = handlerFactory.getAll(reviewModel)


exports.getReview = handlerFactory.getOne(reviewModel)


exports.setProductIdToBody = asyncHandler((req, res, next) => {
    if (!req.body.product) {
        req.body.product = req.params.productId
    }
    next()
})
exports.createReview = handlerFactory.createOne(reviewModel)

exports.updateReview = handlerFactory.updateOne(reviewModel)


exports.deleteReview = handlerFactory.deleteOne(reviewModel)