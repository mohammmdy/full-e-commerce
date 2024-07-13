const express = require('express');


const {
addAddress,
getAddress,
removeAddress
} = require('../services/addressService');

const {
  protect,
  allowedTo
} = require('../services/authService')

const router = express.Router();

router.route('/')
  .post(protect, allowedTo('user'), addAddress)
  .get(protect, allowedTo('user'), getAddress)

router.route('/:addressId')
  .delete(protect, allowedTo('user'), removeAddress)

module.exports = router;