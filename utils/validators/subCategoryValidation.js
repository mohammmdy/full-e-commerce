const { check, body } = require('express-validator')
const validatorMiddleware = require('../../middlewares/validatorMiddleware')
const categoryModel = require('../../models/categoryModel')
const mongoose = require('mongoose');
const slugify = require('slugify')

exports.getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('subCategory required')
    .isLength({ min: 3 })
    .withMessage('Too short subCategory name')
    .isLength({ max: 32 })
    .withMessage('Too long subCategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty().withMessage("category that belong is required")
    .custom(async (val) => {
      if (val) {
        if (!mongoose.Types.ObjectId.isValid(val)) {
          // throw new ApiError('Invalid category ID format');
          return Promise.reject(
            new Error(`Invalid category ID format`))
        }
        const cat = await categoryModel.findById(val);
        if (!cat) {
          throw new Error('No category found for this ID');
        }
      }
      return true;
    }),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category').optional()
    .custom(async (val) => {
      if (val) {
        if (!mongoose.Types.ObjectId.isValid(val)) {
          throw new Error('Invalid category ID format');
        }
        const cat = await categoryModel.findById(val);
        if (!cat) {
          throw new Error('No category found for this ID');
        }
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  validatorMiddleware,
];