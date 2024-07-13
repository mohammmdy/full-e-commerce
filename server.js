const path = require('path')

const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')

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
const{webhookCeckout} = require('./services/orderService')

dbConnection()

const app = express()

app.use(cors())
app.options('*', cors())

app.use(compression())

app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCeckout)

app.use(express.json())

app.use(express.static(path.join(__dirname, 'uploads')))

if (process.env.NODE_ENV == 'development') {
    app.use(morgan("dev"))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

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
