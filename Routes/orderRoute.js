const express = require('express');


const {
  createCashOrder,
  getAllOrders,
  findOneOrder,
  filterOrderLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkOutSession

} = require('../services/orderService');

const {
  protect,
  allowedTo
} = require('../services/authService')

const router = express.Router();


router.route('/:cartId')
  .post(protect, allowedTo('user'), createCashOrder)
  router.route('/:cartId/session').get(protect, allowedTo('user'), checkOutSession)

router.route('/')
  .get(protect, allowedTo('admin', 'manager', 'user'), filterOrderLoggedUser, getAllOrders)

router.route('/:id')
  .get(protect, allowedTo('user'), findOneOrder)

router.use(protect, allowedTo('admin', 'manager'))

router.put('/:id/pay', updateOrderToPaid)
router.put('/:id/deliver', updateOrderToDelivered)

module.exports = router;