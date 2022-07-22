const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {type: String, required: true},
    wlLimit: {type:Number, required: true},
    adminAddress: {type:String, required: true}, 
    listedWl: {type:Number, required: true}
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project