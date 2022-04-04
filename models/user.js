const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    usrname: {
        type: String,
        required: true
    },
    usrpass: {
        type: String,
        required: true
    },
    usrrol: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('User', userSchema)