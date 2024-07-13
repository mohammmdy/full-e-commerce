const jwt = require('jsonwebtoken')

exports.jwtMaker = (userId) => {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    })
}