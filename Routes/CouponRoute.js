const express = require('express');


const {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons
} = require('../services/couponService');

const {
  protect,
  allowedTo
} = require('../services/authService')

const router = express.Router();

router.use(protect, allowedTo('admin', 'manager'))

router.route('/')
  .post(createCoupon)
  .get(getCoupons)

router.route('/:id')
  .delete(deleteCoupon)
  .put(updateCoupon)
  .get(getCoupon)

module.exports = router;