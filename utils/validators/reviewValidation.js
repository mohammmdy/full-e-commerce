const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const reviewModel = require('../../models/reviewModel')


exports.createReviewValidator = [
  check('title').optional(),
  check('ratings').notEmpty().withMessage('ratings required')
    .isFloat({ min: 1, max: 5 }).withMessage('rating value must between 1 : 5 '),
  check('product').isMongoId().withMessage('Invalid product id format')
    .custom(async (val, { req }) => {
      req.body.user = req.user._id
      const user = await reviewModel.findOne({ user: req.body.user, product: val })
      if (user) {
        throw new Error('you are rate this product befor !')
      }
    }),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
];


exports.updateReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format')
    .custom(async (val, { req }) => {
      const review = await reviewModel.findById(val)
      if (!review) {
        throw new Error('no review for this id ')
      }
      if (review.user._id.toString() != req.user._id.toString()) {
        throw new Error('you are not allow to update this review ')

      }
    }),
  check('ratings').optional().isFloat({ min: 1, max: 5 }).withMessage('rating value must between 1 : 5 '),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format')
    .custom(async (val, { req }) => {
      const review = await reviewModel.findById(val)
      if (!review) {
        throw new Error('no review for this id ')
      }
      if (req.user.role == 'user') {

        if (review.user._id.toString() != req.user._id.toString()) {
          throw new Error('you are not allow to delete this review ')

        }
      }
    }),

  validatorMiddleware,
];