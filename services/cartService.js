const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const couponModel = require('../models/couponModel')


exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body
    const product = await productModel.findById(productId)
    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) {
        cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }]
        })
    }
    else {
        // product exist in cartItem
        const existance = cart.cartItems.findIndex((item) =>
            item.product.toString() == productId && item.color == color
        )
        if (existance > -1) {
            let cartItem = cart.cartItems[existance]
            cartItem.quantity += 1
            cart.cartItems[existance] = cartItem
        }

        //product not exist in cartItem
        else {
            cart.cartItems.push({ product: productId, color, price: product.price })
        }
    }
    // calculate total price
    let totalPrice = 0
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price
    })


    cart.totalCartPrice = totalPrice

    await cart.save()
    res.status(200).json({ message: 'added!', cart: cart })
})

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) {
        return next(new ApiError('there is no cart for this user', 404))
    }
    res.status(200).json({ numberOfItems: cart.cartItems.length, data: cart })
})

exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    //cart item exist or not 
    const cartItemIndex = cart.cartItems.findIndex((item) =>
        item._id == req.params.cartItemId
    )
    if (cartItemIndex < 0) {
        return res.status(404).json({ message: 'CartItem not found' });
    }
    // quantity of item more than 1
    if (cart.cartItems[cartItemIndex].quantity > 1) {
        let item = cart.cartItems[cartItemIndex]
        item.quantity -= 1
        cart.cartItems[cartItemIndex] = item
    }
    else {
        cart.cartItems.splice(cartItemIndex, 1)
    }

    let totalPrice = 0
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price
    })

    cart.totalCartPrice = totalPrice
    // console.log(cart);
    await cart.save()
    res.status(200).json({ message: 'updated!', cart: cart })

})

exports.removeCart = asyncHandler(async (req, res, next) => {
    await cartModel.deleteOne({ user: req.user._id })
    res.status(200).send()
})


exports.applyCoupon = asyncHandler(async (req, res, next) => {
    // 1) Get coupon based on coupon name
    const coupon = await couponModel.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() },
    });

    if (!coupon) {
        return next(new ApiError(`Coupon is invalid or expired`));
    }

    // 2) Get logged user cart to get total cart price
    const cart = await cartModel.findOne({ user: req.user._id });

    const totalPrice = cart.totalCartPrice;

    // 3) Calculate price after priceAfterDiscount
    const totalPriceAfterDiscount = (
        totalPrice -
        (totalPrice * coupon.discount) / 100
    ).toFixed(2); // 99.23

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
})