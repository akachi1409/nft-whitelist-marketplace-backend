const { Router } = require("express");
const fs = require("fs");
const AWS = require("aws-sdk");
const router = new Router({ mergeParams: true });
const Project = require("../../models/Project");
const User = require("../../models/User");
/** Require multer */
const multer = require('multer');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})

router.get("/list", async (req, res) => {
  try {
    Project.find({}, (err, projects) => {
      if (err) {
        res.status(500).json({ success: false, error: "Server error" });
      }
      // console.log("users", projects);
      res.json({ success: true, projects: projects });
    });
  } catch (err) {
    console.log("Error getting an asset from user assets");
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.put("/update", async(req, res) => {
  try {
    const formData = req.files;
    const original = req.body.original;
    const fileName = req.body.fileName;
    const project = req.body.name;
    const limit = req.body.limit;
    const description = req.body.description;
    const etherPrice = req.body.etherPrice;
    const clankPrice = req.body.clankPrice;
    const endTime= req.body.endTime;
    const wlProject = await Project.find({
      _id: original,
    });
    if (wlProject.length ==1) {
      
      var file = formData[fileName]
      s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: wlProject[0].projectName.replace(/ /g,"_")
      }, (err, data) => {
        console.error(err);
        console.log(data);
      })
      const uploadedImage =  await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: project.replace(/ /g,"_"),
        Body: file.data,
      }).promise();
      wlProject[0].description = description;
      wlProject[0].projectName = project;
      wlProject[0].wlLimit = limit;
      wlProject[0].etherPrice = etherPrice;
      wlProject[0].clankPrice = clankPrice;
      wlProject[0].endTime = endTime;
      wlProject[0].imageName = uploadedImage.Location
      wlProject[0].save();
      return res.json({ success: true, newProject: wlProject[0] });
    }
    else{
      res.status(500).json({ success: false, error: "Project not exists." });
      return;
    }
  }catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }

})
router.post("/insert", async (req, res) => {
    // console.log("req", req);
  try {
    const formData = req.files;
    const fileName = req.body.fileName;
    const project = req.body.name;
    const limit = req.body.limit;
    const description = req.body.description;
    const etherPrice = req.body.etherPrice;
    const clankPrice = req.body.clankPrice;
    const endTime= req.body.endTime;
    const wlProject = await Project.find({
      projectName: project,
    });
    if (wlProject.length > 0) {
      console.log("=------------------", endTime);
      res.status(500).json({ success: false, error: "Project already exists." });
      return;
    }
    var file = formData[fileName]
    console.log(process.env.AWS_S3_BUCKET_NAME)
    const uploadedImage =  await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: project.replace(/ /g,"_"),
      Body: file.data,
    }).promise();
    const newProject = new Project({
      endTime: endTime,
      projectName: project,
      wlLimit: limit,
      description: description,
      listedWl: 0,
      etherPrice: etherPrice,
      clankPrice: clankPrice,
      imageName: uploadedImage.Location,
      fileName: fileName,
    });
    console.log(newProject);
    await newProject.save();
    return res.json({ success: true, newProject: newProject });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/project", async (req, res) => {
  try {
    const orders = [];
    User.find({}, (err, users)=>{
      if (err) {
        res.status(500).json({ success: false, error: "Server error" });
      }
      for (var i = 0 ; i< users.length; i++){
        var orders1 = users[i].orders;
        for (var j = 0 ; j<orders1.length; j ++){
          var order ={
            walletAddress: orders1[j].walletAddress,
            discordID: orders1[j].discordID,
            orderDate: orders1[j].orderDate,
            totalEther: orders1[j].totalEther,
            totalClank: orders1[j].totalClank,
            orderNumber: orders1[j].orderNumber,
            whitelist: orders1[j].whitelist,
            owner : users[i].address
          } 
          orders.push(order);
          // orders1[j].owner = users[i].address;
          // orders.push(orders1[j])
        }
      }
      res.json({ success : true, orders: orders})
    })
  } catch (err) {
    console.log("Error getting an asset from user assets");
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
})

router.get("/:projectID", async (req, res)=>{
  const projectID = req.params.projectID;
  console.log("projectID", projectID);
  try{
    Project.findOne({_id: projectID}, (err, project)=>{
      if (err) {
        return res.status(500).json({ success: false, error:err})
      }
      res.json({success: true, project: project})
    })
  }catch (err) {
    console.log("Error getting the details of the project with the name of " + projectName);
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
})
router.delete("/delete/:projectID", async (req, res) => {
  const projectID = req.params.projectID;
  try{
    const project = await Project.findOne({_id: projectID})
    s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: project.projectName.replace(/ /g,"_")
    }, (err, data) => {
      console.error("Error in removing", err);
      console.log(data);
    })
    await Project.deleteOne({_id: projectID} )
    res.json({ success : true})
  }catch (err) {
    console.log("Error deleting in project.");
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
})
module.exports = router;
