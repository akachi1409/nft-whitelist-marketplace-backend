/* eslint-disable max-len */
const { Router } = require("express");
const router = new Router({ mergeParams: true });
const User = require("../../models/User");
const Project = require("../../models/Project");
// const path = require("path");
router.get("/project/:project", async (req, res) =>{
  const project = req.params.project;
  console.log("====", project);
  try{
    const p = await Project.findOne({projectName: project});
    console.log("p", p);
    res.json({ success: true, number: p.listedWl, limit: p.wlLimit})
  }catch (err) {
    console.log("Error getting the number of whitelisted users.");
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
})
router.get("/address/list/:project", async (req, res) => {
  const project = req.params.project;
  try {
    User.find({project:project}, (err, users) => {
      if (err) {
        res.status(500).json({ success: false, error: "Server error" });
      }
      console.log("users", users);
      res.json({ success: true, users: users });
    });
  } catch (err) {
    console.log("Error getting an asset from user assets");
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
router.get("/address/:address/:project", async (req, res) => {
  const address = req.params.address;
  const project = req.params.project;
  try {
    const user = await User.findOne({ address: address, project: project });
    res.json({ success: true, user: user });
  } catch (err) {
    console.log("Error getting an asset from user assets");
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/address/insert", async (req, res) => {
  const address = req.body.address;
  const project = req.body.project;
  const userNum = await User.countDocuments();
  try {
    const user = new User({
      user_id: userNum + 1,
      address: address,
      project: project,
    });
    const wlProject = Project.findOne({
      projectName: project,
    });
    if (wlProject) {
      wlProject.listedWl++;
      await wlProject.save();
    } else {
      res.status(500).json({ success: false, error: "Project not found." });
    }
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
module.exports = router;
