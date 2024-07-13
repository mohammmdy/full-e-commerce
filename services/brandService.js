const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')

const brandModel = require('../models/brandModel')
const handlerFactory = require('./handlersFactory')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')


exports.uploadBrandImage = uploadSingleImage('image')


exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/brands/${filename}`)

        // save image in DB
        req.body.image = filename
    }

    next()
})


exports.getBrands = handlerFactory.getAll(brandModel)


exports.getBrand = handlerFactory.getOne(brandModel)

exports.createBrand = handlerFactory.createOne(brandModel)

exports.updateBrand = handlerFactory.updateOne(brandModel)


exports.deleteBrand = handlerFactory.deleteOne(brandModel)