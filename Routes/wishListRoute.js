const express = require('express');


const {
  addProductToWishList,
  removeProductFromWishList,
  getWishListProductsUser
} = require('../services/wishListService');

const {
  protect,
  allowedTo
} = require('../services/authService')

const router = express.Router();

router.route('/')
  .post(protect, allowedTo('user'), addProductToWishList)
  .get(protect, allowedTo('user'), getWishListProductsUser)

router.route('/:productId')
  .delete(protect, allowedTo('user'), removeProductFromWishList)

module.exports = router;