const mongoose = require('mongoose');
const productModel = require('./productModel')
const reviewSchema = new mongoose.Schema({

    title: {
        type: String
    },
    ratings: {
        type: Number,
        min: [1, 'Min ratings is 1'],
        max: [5, 'Max ratings is 5'],
        required: [true, 'ratings required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to user']
    },
    //parent ref
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'review must belong to product']
    }

}, { timestamps: true })

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: "user", select: 'name' })
    next()
})


reviewSchema.statics.calcAvgRatingAndQuantitiy = async function (productId) {
    const result = await this.aggregate([
        //stage 1
        {
            $match: { product: productId }
        },
        //stage 2
        {
            $group: {
                _id: 'product',
                avgRatings: { $avg: '$ratings' },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ])
    // console.log(result);
    if (result.length > 0) {
        await productModel.findByIdAndUpdate(productId,
            {
                ratingsAverage: result[0].avgRatings,
                ratingsQuantity: result[0].ratingsQuantity
            },
            { new: true }
        )
    }
    else {
        await productModel.findByIdAndUpdate(productId,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0
            },
            { new: true }
        )
    }

}
reviewSchema.post('save', async function () {
    await this.constructor.calcAvgRatingAndQuantitiy(this.product)
})
reviewSchema.post('init', async function () {
    await this.constructor.calcAvgRatingAndQuantitiy(this.product)
})

module.exports = mongoose.model('Review', reviewSchema);