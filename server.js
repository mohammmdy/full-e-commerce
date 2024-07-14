const path = require('path')

const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')

// // limit number requests in specific time  npm i express-rate-limit
// const rateLimit = require('express-rate-limit')


// redundant parameter in request sort sort   npm i hpp --save
// const hpp = require('hpp')

dotenv.config({ path: 'config.env' })
const dbConnection = require('./config/database')
const ApiError = require('./utils/apiError')
const globalError = require('./middlewares/errorMiddleware')
const categoryRoute = require('./Routes/categoryRoute')
const subCategoryRoute = require('./Routes/subCategoryRoute')
const brandRoute = require('./Routes/brandRoute')
const productRoute = require('./Routes/productRoute')
const userRoute = require('./Routes/userRoute')
const authRoute = require('./Routes/authRoute')
const reviewRoute = require('./Routes/reviewRoute')
const wishListRoute = require('./Routes/wishListRoute')
const addressRoute = require('./Routes/addressRoute')
const CouponRoute = require('./Routes/CouponRoute')
const cartRoute = require('./Routes/cartRoute')
const orderRoute = require('./Routes/orderRoute')
const { webhookCeckout } = require('./services/orderService')

dbConnection()

const app = express()

app.use(cors())
app.options('*', cors())

app.use(compression())

app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCeckout)

app.use(express.json())

// //security limit request size  replace line 38 with it
// app.use(express.json({ limit: '20kb' }))

app.use(express.static(path.join(__dirname, 'uploads')))

if (process.env.NODE_ENV == 'development') {
    app.use(morgan("dev"))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// // hpp parameter
// app.use(hpp({ whitelist: ['price'] }))


//---------------------------------------------------------------------------------
// //rate limit 
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//     message:
//         'to many accounts created from this api , please try again after two minute'
// })

// // Apply the rate limiting middleware to all requests.
// app.use('/e-commerce', limiter)
//----------------------------------------------------------------------------------------


app.use('/e-commerce/category', categoryRoute)
app.use('/e-commerce/subCategory', subCategoryRoute)
app.use('/e-commerce/brand', brandRoute)
app.use('/e-commerce/product', productRoute)
app.use('/e-commerce/user', userRoute)
app.use('/e-commerce/auth', authRoute)
app.use('/e-commerce/review', reviewRoute)
app.use('/e-commerce/wishListRoute', wishListRoute)
app.use('/e-commerce/addressRoute', addressRoute)
app.use('/e-commerce/CouponRoute', CouponRoute)
app.use('/e-commerce/cartRoute', cartRoute)
app.use('/e-commerce/orderRoute', orderRoute)

app.all('*', (req, res, next) => {
    next(new ApiError(`can't find this route ${req.originalUrl}`, 400))
})
app.use(globalError)

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
    console.log('app running');
})

process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection error!: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`shutdown...`);
        process.exit(1)
    })
})
