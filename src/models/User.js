const mongoose = require('mongoose');

const whitelistHistory = new mongoose.Schema({
    whitelistPicture: {type: String, rquired: true},
    whitelistName: {type:String, required: true},
    quantity: {type:Number, required: true},
    etherCost: {type:Number, required: true},
    clankCost: {type:Number, required: true},
})
const orderHistory = new mongoose.Schema({
    owner: {type:String},
    walletAddress: {type:String, required: true},
    discordID: {type:String, required: false},
    orderDate: {type:Date, required: true},
    totalEther: {type:Number, required: true},
    totalClank: {type:Number, required: true},
    orderNumber: {type:Number, required: true},
    whitelist: [whitelistHistory]
})
const userSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    address: {type: String, required: true},
    lastUpdate: {type:Date, required: true},
    
    orders: [orderHistory]
})

const User = mongoose.model('User', userSchema);

module.exports = User;