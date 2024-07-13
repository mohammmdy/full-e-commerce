const asyncHandler = require('express-async-handler');
const couponModel = require('../models/couponModel')
const handlerFactory = require('./handlersFactory')


exports.getCoupons = handlerFactory.getAll(couponModel)


exports.getCoupon = handlerFactory.getOne(couponModel)

exports.createCoupon = handlerFactory.createOne(couponModel)

exports.updateCoupon = handlerFactory.updateOne(couponModel)


exports.deleteCoupon = handlerFactory.deleteOne(couponModel)