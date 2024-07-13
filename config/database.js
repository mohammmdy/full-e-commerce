//connect with db
const mongoose = require('mongoose')

const dbConnection = () => {
    mongoose.connect(process.env.DB_URL).then((conn) => {
        console.log(`db connected!: ${conn.connection.host}`);
    })
    // .catch((err) => {
    //     console.log(`db error!: ${err}`);
    //     process.exit(1)
    // })
}

module.exports = dbConnection