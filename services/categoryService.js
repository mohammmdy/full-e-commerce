const categoryModel = require('../models/categoryModel')
const handlerFactory = require('./handlersFactory')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')


const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')
const asyncHandler = require('express-async-handler');




exports.uploadCategoryImage = uploadSingleImage('image')


exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
    if (req.file) {

        await sharp(req.file.buffer)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/categories/${filename}`)

        // save image in DB
        req.body.image = filename
    }
    next()
})


exports.createCategory = handlerFactory.createOne(categoryModel)


exports.getAllCategories = handlerFactory.getAll(categoryModel)


exports.getCategory = handlerFactory.getOne(categoryModel)


exports.updateCategory = handlerFactory.updateOne(categoryModel)


exports.deleteCategory = handlerFactory.deleteOne(categoryModel)