const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const ApiError = require('../utils/apiError')
const sharp = require('sharp')
const asyncHandler = require('express-async-handler');


exports.uploadSingleImage = (fieldName) => {
    // // disk storage engine
    // const multerStorage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'uploads/categories')
    //     },
    //     filename: function (req, file, cb) {
    //         const ext = file.mimetype.split('/')[1]
    //         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
    //         cb(null, filename)
    //     }
    // })


    // memory storage engine
    const multerStorage = multer.memoryStorage()

    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        }
        else {
            cb(new ApiError(`only images allow`, 400), false)
        }
    }

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
    return upload.single(fieldName)

}


exports.uploadMultiImage = (fieldName, fieldsName) => {
    // memory storage engine
    const multerStorage = multer.memoryStorage()
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        }
        else {
            cb(new ApiError(`only images allow`, 400), false)
        }
    }

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
    return upload.fields([
        { name: fieldName, maxCount: 1 },
        { name: fieldsName, maxCount: 5 }
    ])

}





exports.resizeImage = asyncHandler(async (req, res, next) => {
    if (req.files.imageCover) {
        const imageCover = `product-imageCover-${uuidv4()}-${Date.now()}.jpeg`
        await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imageCover}`)
        
        // save image in DB
        req.body.imageCover = imageCover
    }
    // console.log('gg');
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
            const image = `product-image-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
            await sharp(img.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`uploads/products/${image}`);

            req.body.images.push(image);
        })
    );
    }
    next()
})