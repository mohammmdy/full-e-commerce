const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userModel = require('../models/userModel')
const handlerFactory = require('./handlersFactory')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')
const ApiError = require('../utils/apiError');
const { jwtMaker } = require('../utils/jwt')

exports.uploadUserImage = uploadSingleImage('profileImg')
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`

    if (req.file) {

        await sharp(req.file.buffer)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${filename}`)

        // save image in DB
        req.body.profileImg = filename
    }
    next()
})


exports.getUsers = handlerFactory.getAll(userModel)
exports.getUser = handlerFactory.getOne(userModel)
exports.createUser = handlerFactory.createOne(userModel)
exports.updateUser = handlerFactory.updateOne(userModel)
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = await userModel.findOneAndUpdate(
        { _id: id },
        {
            password: await bcrypt.hash(req.body.newPassword, 12),
            passwordChangedAt: Date.now()
        },
        { new: true }
    );

    if (!data) {
        // res.status(404).json({ msg: `No data for this id ${id}` });
        return next(new ApiError(`No data for this id ${id}`, 404))
    }
    res.status(200).json({ data: data });
});
exports.deleteUser = handlerFactory.deleteOne(userModel)





exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id
    next()
})
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {

    const data = await userModel.findOneAndUpdate(
        { _id: req.user._id },
        {
            password: await bcrypt.hash(req.body.newPassword, 12),
            passwordChangedAt: Date.now()
        },
        { new: true }
    );

    if (!data) {
        // res.status(404).json({ msg: `No data for this id ${id}` });
        return next(new ApiError(`No data for this id ${id}`, 404))
    }

    const token = jwtMaker(req.user._id)
    res.status(200).json({ data: data, token });
})
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id
    next()
})
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOneAndUpdate(
        { _id: req.user._id },
        {
            active: false
        },
        { new: true }

    )
    res.status(204).json({ status: 'sucess' })
    next()
})
