const express = require('express');
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator
} = require('../utils/validators/reviewValidation');

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  filterProduct,
  setProductIdToBody
} = require('../services/reviewService');

const {
  protect,
  allowedTo
} = require('../services/authService')

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(filterProduct, getReviews)
  .post(protect, allowedTo('user'),setProductIdToBody, createReviewValidator, createReview);
router
  .route('/:id')
  .get(getReview)
  .put(protect, allowedTo('user'), updateReviewValidator, updateReview)
  .delete(protect, allowedTo('admin', 'user', 'manager'), deleteReviewValidator, deleteReview);

module.exports = router;