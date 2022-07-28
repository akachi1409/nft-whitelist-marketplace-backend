const { Router } = require("express");
const fs = require("fs");
const router = new Router({ mergeParams: true });
const Project = require("../../models/Project");

router.get("/list", async (req, res) => {
  try {
    Project.find({}, (err, projects) => {
      if (err) {
        res.status(500).json({ success: false, error: "Server error" });
      }
      console.log("users", projects);
      res.json({ success: true, projects: projects });
    });
  } catch (err) {
    console.log("Error getting an asset from user assets");
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
router.post("/insert", async (req, res) => {
    // console.log("req", req);
  const formData = req.files;
  console.log("formData", formData);
  const fileName = req.body.fileName;
  const project = req.body.name;
  const limit = req.body.limit;
  const address = req.body.address;
  const etherPrice = req.body.etherPrice;
  const clankPrice = req.body.clankPrice;
  const wlProject = await Project.find({
    projectName: project,
  });
  console.log(wlProject.length);
  if (wlProject.length > 0) {
    console.log("=------------------");
    res.status(500).json({ success: false, error: "Project already exists." });
    return;
  }
  const dir = "./uploads";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  var file = formData[fileName]
  uploadPath = dir + "/" + project + "." + file.name.split(".")[1];
  file.mv(uploadPath, function (err) {
    if (err) {
      console.log("err:", err);
      return res.status(500).send(err);
    }
  });
  const newProject = new Project({
    projectName: project,
    wlLimit: limit,
    adminAddress: address,
    listedWl: 0,
    etherPrice: etherPrice,
    clankPrice: clankPrice,
    imageName: project+ "." + file.name.split(".")[1]
  });
  console.log(newProject);
  try {
    await newProject.save();
    return res.json({ success: true, newProject: newProject });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});
module.exports = router;
