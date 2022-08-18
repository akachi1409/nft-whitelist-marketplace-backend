const mongoose = require('mongoose');

const whitelistHistory = new mongoose.Schema({
    whitelistPicture: {type: String, rquired: true},
    whitelistName: {type:String, required: true},
    quantity: {type:Number, required: true}
})
const orderHistory = new mongoose.Schema({
    walletAddress: {type:String, required: true},
    discordID: {type:String, required: true},
    orderDate: {type:Date, required: true},
    etherCost: {type:Number, required: true},
    clankCost: {type:Number, required: true},
    whitelist: [whitelistHistory]
})
const userSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    address: {type: String, required: true},
    project: {type: String, required: true},
    orders: [orderHistory]
})

const User = mongoose.model('User', userSchema);

module.exports = User;