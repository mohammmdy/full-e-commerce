const express = require('express');

const { createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage
} = require('../services/categoryService')

const { createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
    getCategoryValidator
} = require('../utils/validators/categoryValidation')


const {
    protect,
    allowedTo
} = require('../services/authService')

const subCategoryRoute = require('./subCategoryRoute')



const router = express.Router()

router.use('/:categoryId/subCategories', subCategoryRoute)

router.route('/').post(protect, allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory).get(getAllCategories)
router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(protect, allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
    .delete(protect, allowedTo('admin'), deleteCategoryValidator, deleteCategory)

module.exports = router;