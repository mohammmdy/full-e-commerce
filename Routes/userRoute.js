const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updatePasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserDataValidator

} = require('../utils/validators/userValidation');

const {
  uploadUserImage,
  resizeImage,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  updatePassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser
} = require('../services/userService');


const {
  protect,
  allowedTo
} = require('../services/authService')

const router = express.Router();

router.route('/getLoggedUserData').get(protect, getLoggedUserData, getUser)
router.route('/updateLoggedUserPassword').put(protect, updateLoggedUserPasswordValidator, updateLoggedUserPassword)
router.route('/updateLoggedUserData').put(protect, updateLoggedUserDataValidator, updateLoggedUserData, updateUser)
router.route('/deleteLoggedUser').delete(protect, deleteLoggedUser)

router.route('/')
  .get(protect, allowedTo('admin', 'manager'), getUsers)
  .post(protect, allowedTo('admin'), uploadUserImage, resizeImage, createUserValidator, createUser);


router
  .route('/:id')
  .get(protect, allowedTo('admin'), getUserValidator, getUser)
  .put(protect, allowedTo('admin'), uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser);

router.route('/updatePassword/:id').put(updatePasswordValidator, updatePassword)

// router.use(allowedTo('admin'))
module.exports = router;