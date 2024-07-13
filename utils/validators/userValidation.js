const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const slugify = require('slugify')
const userModel = require('../../models/userModel')
const bcrypt = require('bcryptjs')

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.createUserValidator = [
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
  check('profileImg').optional(),
  check('role').optional(),
  check('phone').optional().isMobilePhone('ar-EG').withMessage('mobile must be from egypt'),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .optional()
    .isEmail().withMessage('enter valid email ')
    .custom(async (val) => {
      const isValid = await userModel.findOne({ email: val })
      if (isValid) {
        throw new Error('this email exist !')
      }
      return true
    }),
  check('phone').optional().isMobilePhone('ar-EG').withMessage('mobile must be from egypt'),

  validatorMiddleware,
];

exports.updatePasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  check('currentPassword')
    .notEmpty().withMessage('you must enter your current pass'),
  check('passwordConfirm')
    .notEmpty().withMessage('you must enter password confirm'),
  check('newPassword')
    .notEmpty().withMessage('you must enter a new pass')
    .custom(async (val, { req }) => {
      //check user exist
      const user = await userModel.findById(req.params.id)
      if (!user) {
        throw new Error('no user for this id ')
      }
      //check current pass
      const vaild = await bcrypt.compare(req.body.currentPassword, user.password)
      if (!vaild) {
        throw new Error('this currentPassword is not correct!')
      }
      //check password confirm
      if (req.body.passwordConfirm != req.body.newPassword) {
        throw new Error('this passwordConfirm is not correct!')

      }

    })


  , validatorMiddleware
]


exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.updateLoggedUserPasswordValidator = [
  check('currentPassword')
    .notEmpty().withMessage('you must enter your current pass'),
  check('passwordConfirm')
    .notEmpty().withMessage('you must enter password confirm'),
  check('newPassword')
    .notEmpty().withMessage('you must enter a new pass')
    .custom(async (val, { req }) => {
      //check current pass
      const vaild = await bcrypt.compare(req.body.currentPassword, req.user.password)
      if (!vaild) {
        throw new Error('this currentPassword is not correct!')
      }
      //check password confirm
      if (req.body.passwordConfirm != req.body.newPassword) {
        throw new Error('this passwordConfirm is not correct!')

      }

    })


  , validatorMiddleware
]

exports.updateLoggedUserDataValidator = [
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .optional()
    .isEmail().withMessage('enter valid email ')
    .custom(async (val) => {
      const isValid = await userModel.findOne({ email: val })
      if (isValid) {
        throw new Error('this email exist !')
      }
      return true
    })
  ,
  check('phone').optional().isMobilePhone('ar-EG').withMessage('mobile must be from egypt'),

  validatorMiddleware,
];