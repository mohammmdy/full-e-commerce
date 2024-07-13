const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel')


exports.addAddress = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id,
        {
            $addToSet: { addresses: req.body }
        },
        { new: true }
    )
    res.status(200).json({ status: 'add success', addresses: user.addresses })
})

exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id,
        {
            $pull: {
                addresses: { _id: req.params.addressId }
            }
        },
        { new: true }
    )
    res.status(200).json({ status: 'remove success', addresses: user.addresses })
})

exports.getAddress = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    res.status(200).json({ addresses: user.addresses })
})