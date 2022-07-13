const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    address: {type: String, required: true},
    project: {type: String, required: true},
})

const User = mongoose.model('User', userSchema);

module.exports = User;