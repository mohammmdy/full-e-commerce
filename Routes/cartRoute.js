const express = require('express');


const {
  addProductToCart,
  getLoggedUserCart,
  removeProductFromCart,
  removeCart,
  applyCoupon
} = require('../services/cartService');

const {
  protect,
  allowedTo
} = require('../services/authService')

const router = express.Router();

router.route('/')
  .post(protect, allowedTo('user'), addProductToCart)
  .get(protect, allowedTo('user'), getLoggedUserCart)
  .delete(protect, allowedTo('user'), removeCart)

router.route('/:cartItemId')
  .delete(protect, allowedTo('user'), removeProductFromCart)

router.route('/applyCoupon')
  .post(protect, allowedTo('user'), applyCoupon)

module.exports = router;