
const mongoose = require('mongoose')

const mongUrl = "mongodb+srv://hari_123:shhanuman@mydatabase.1had77f.mongodb.net/notebook"

const connectToMo = () => {
    mongoose.connect(mongUrl);
    console.log("mongoose is connected")
}

module.exports = connectToMo ;