const asyncHandler = require('express-async-handler');
const subCategoryModel = require('../models/subCategoryModel')
const handlerFactory = require('./handlersFactory')




exports.setCategoryIdToBody = asyncHandler((req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId
    }
    next()
})
exports.createSubCategory = handlerFactory.createOne(subCategoryModel)




exports.filterCategory = asyncHandler((req, res, next) => {
    let filter = {}
    if (req.params.categoryId) {
        filter = { category: req.params.categoryId }
    }
    req.filterObj = filter
    next()
})
exports.getAllSubCategories = handlerFactory.getAll(subCategoryModel)






exports.getSubCategory = handlerFactory.getOne(subCategoryModel)

exports.updateSubCategory = handlerFactory.updateOne(subCategoryModel)

exports.deleteSubCategory = handlerFactory.deleteOne(subCategoryModel)