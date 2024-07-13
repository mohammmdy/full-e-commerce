const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const slugify = require('slugify')
const userModel = require('../../models/userModel')
const bcrypt = require('bcryptjs')



exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty().withMessage('must enter email')
    .isEmail().withMessage('enter valid email ')
    .custom(async (val) => {
      const isValid = await userModel.find({ email: val })
      if (isValid.length > 0) {
        throw new Error('this email exist !')
      }
      return true
    }),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  check('passwordConfirm')
    .notEmpty().withMessage('please enter passwordConfirm')
    .custom((val, { req }) => {
      // console.log(req.body.password);
      if (val != req.body.password) {
        console.log('gg');
        throw new Error('this passwordConfirm not match with password')
      }
      return true
    }),
  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty().withMessage('must enter email')
    .isEmail().withMessage('enter valid email '),
  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
  , validatorMiddleware
]