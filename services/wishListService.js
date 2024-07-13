const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel')


exports.addProductToWishList = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id,
        {
            $addToSet: { wishList: req.body.productId }
        },
        { new: true }
    )
    res.status(200).json({ status: 'add success', wishList: user.wishList })
})

exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id,
        {
            $pull: { wishList: req.params.productId }
        },
        { new: true }
    )
    res.status(200).json({ status: 'remove success', wishList: user.wishList })
})

exports.getWishListProductsUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate({ path: 'wishList' })
    res.status(200).json({ wishList: user.wishList })
})