const { Router } = require("express");
const router = new Router({ mergeParams: true });
const Project = require("../../models/Project");

router.post("/insert", async(req, res)=>{
    const project = req.body.name;
    const limit = req.body.limit;
    const address = req.body.address;
    const wlProject =await Project.find({ 
        projectName: project
    });
    console.log(wlProject.length)
    if (wlProject.length>0){
        console.log("=------------------")
        res.status(500).json({ success: false, error: "Project already exists." });
        return;
    }
    const newProject = new Project({
        projectName: project,
        wlLimit: limit,
        adminAddress: address,
        listedWl: 0
    })
    console.log(newProject)
    try{
        await newProject.save();
        return res.json({ success: true, newProject: newProject})
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
})
module.exports = router;