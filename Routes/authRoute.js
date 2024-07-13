const express = require('express');
const {
  signupValidator
  , loginValidator
} = require('../utils/validators/authValidation');

const {
  signup,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword
} = require('../services/authService');

const router = express.Router();

router.route('/signup').post(signupValidator, signup)
router.route('/login').post(loginValidator, login)
router.route('/forgetPassword').post(forgetPassword)
router.route('/verifyPassResetCode').post(verifyPassResetCode)
router.route('/resetPassword').post(resetPassword)
module.exports = router;