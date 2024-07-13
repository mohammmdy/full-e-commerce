const express = require('express');

const {
    createSubCategory,
    getAllSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    filterCategory,
    setCategoryIdToBody
} = require('../services/subCategoryService')

const { createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
} = require('../utils/validators/subCategoryValidation')


const {
    protect,
    allowedTo
} = require('../services/authService')


const router = express.Router({ mergeParams: true })

router.route('/')
    .post(protect, allowedTo('admin', 'manager'), setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
    .get(filterCategory, getAllSubCategories)
router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(protect, allowedTo('admin', 'manager'), updateSubCategoryValidator, updateSubCategory)
    .delete(protect, allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategory)

module.exports = router;