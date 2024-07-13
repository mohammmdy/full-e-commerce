const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');
const { sendEmail } = require('../utils/sendEmail')
const { jwtMaker } = require('../utils/jwt')

exports.protect = asyncHandler(async (req, res, next) => {
    // check if token exist
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ApiError('you are not login, please login!', 401))
    }

    //verify token not change or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    // console.log(decoded);

    //check user exist
    const user = await userModel.findById(decoded.userId)
    if (!user) {
        return next(new ApiError("this user doesn't exist", 401))
    }
    //check user change pass
    if (user.passwordChangedAt) {
        const passChangedatTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10)
        // console.log(passChangedatTimestamp, decoded.iat);
        if (passChangedatTimestamp > decoded.iat) {
            return next(new ApiError("this user change pass , please login again!", 401))
        }
    }
    req.user = user
    next()
})


exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError('you are not authorized!', 403))
        }
        next()
    })

exports.signup = asyncHandler(async (req, res, next) => {
    //create user
    const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    //genirate token
    const token = jwtMaker(user._id)

    res.status(201).json({ data: user, token })
})

exports.login = asyncHandler(async (req, res, next) => {
    //check email and password correct and exist
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(new ApiError('no user for this email', 404))
    }
    if (! await bcrypt.compare(req.body.password, user.password)) {
        return next(new ApiError('this password not correct', 401))
    }

    //generate token
    const token = jwtMaker(user._id)

    res.status(200).json({ data: user, token })
})

exports.forgetPassword = asyncHandler(async (req, res, next) => {
    //user exist
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(new ApiError('no user for this email', 404))
    }

    //if exist generate hash reset random 6digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedReset = crypto.createHash('sha256').update(resetCode).digest('hex')

    user.passwordResetCode = hashedReset
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000
    user.passwordResetVerified = false

    await user.save()


    // send the reset code to email 
    const subject = `your password reset code (vaild for 10 minute)`
    const message = `hi ${user.name} ! \n your reset code is ${resetCode}`
    try {
        await sendEmail({ email: user.email, subject: subject, message: message })

    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save()
        return next(new ApiError(`can't send email `, 500))
    }
    res.status(200).json({ status: 'success', message: 'reset code send successfully' })
})

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
    const hashedReset = crypto.createHash('sha256').update(req.body.resetCode).digest('hex')
    const user = await userModel.findOne({ passwordResetCode: hashedReset, passwordResetExpires: { $gt: Date.now() } })
    if (!user) {
        return next(new ApiError(`this reset code not correct,or expired `, 500))

    }
    user.passwordResetVerified = true
    await user.save()

    //generate token
    const token = jwtMaker(user._id)

    res.status(200).json({ status: 'success', token })
})

exports.resetPassword = asyncHandler(async (req, res, next) => {

    //validators
    if (req.body.passwordConfirm != req.body.newPassword) {
        return next(new ApiError(`password passwordConfirm isn't correct `, 401))
    }

    //get user from token
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ApiError('go to forget password agian ! ', 401))
    }

    //verify token not change or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    // console.log(decoded.userId);

    const user = await userModel.findById(decoded.userId)
    // console.log(user);

    //check user verify pass
    if (!user.passwordResetVerified) {
        return next(new ApiError('reset code not verify ! ', 401))
    }

    user.password = req.body.newPassword

    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save()
    res.status(200).json({ data: 'password updated successfully' })
})