const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {type: String, required: true, unique: true},
    wlLimit: {type:Number, required: true},
    // adminAddress: {type:String, required: true}, 
    listedWl: {type:Number, required: true},
    etherPrice: {type:Number, required: true},
    clankPrice: {type:Number, required: true},
    imageName: {type:String, require:true},
    description: {type:String, required: true},
    endTime: {type:Date},
    fileName: {type:String, required: true},
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project