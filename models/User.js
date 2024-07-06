const { default: mongoose, Schema } = require("mongoose");

const userSchema = new Schema({
    name:{
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', userSchema);
User.createIndexes()
module.exports = User;