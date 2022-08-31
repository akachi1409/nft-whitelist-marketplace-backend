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

router.get("/address/orders/:address", async (req, res) => {
  const address = req.params.address;
  const user = await User.findOne({ address: address });
  if (user){
    const orders = user.orders;
    res.json({success: true, orders: orders})
  }else{
    res.status(500).json({success: false, error: "No user found!"})
  }
})
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
router.post("/address/insertCart", async (req, res) => {
  const owner = req.body.owner;
  const address = req.body.address;
  const discordID = req.body.discordID;
  const cartInfo = req.body.cartInfo;
  const etherCost = req.body.etherCost;
  const clankCost = req.body.clankCost;
  const userNum = await User.countDocuments();
  console.log("---------------")
  let lastNumber;
  if (userNum == 0){
    lastNumber = 0;
  }else{
    const lastUser = await User.find().sort({lastUpdate: "asc"}).skip(userNum - 1);
    lastNumber =lastUser[0].orders[lastUser[0].orders.length-1].orderNumber
  }
  try{
    const user = await User.findOne({ address: owner });
    if (user){
      const orders = user.orders;
      const whitelist = []
      cartInfo.map(async (item, index)=> {
        const newWL = {
          whitelistPicture: item.img,
          whitelistName: item.projectName,
          quantity: item.quantity,
          etherCost: item.totalEther,
          clankCost: item.totalClank,
        }
        whitelist.push(newWL);
        const wlProject =await Project.findOne({
          projectName: item.projectName,
        });
        console.log(wlProject)
        if (wlProject) {
          wlProject.listedWl+= item.quantity;
          await wlProject.save();
        } else {
          res.status(500).json({ success: false, error: "Project not found." });
        }
      })
      const newOrder = {
        walletAddress: address,
        discordID: discordID,
        orderDate: new Date(),
        totalEther: etherCost,
        totalClank: clankCost,
        whitelist: whitelist,
        orderNumber: lastNumber + 1,
      }
      orders.push(newOrder);
      user.lastUpdate = new Date();
      console.log("Order:------",orders)
      user.save();
    }
    else{
      const whitelist = []
      cartInfo.map(async (item, index)=> {
        const newWL = {
          whitelistPicture: item.img,
          whitelistName: item.projectName,
          quantity: item.quantity,
          etherCost: item.totalEther,
          clankCost: item.totalClank,
        }
        whitelist.push(newWL);
        const wlProject =await Project.findOne({
          projectName: item.projectName,
        });
        console.log(wlProject)
        if (wlProject) {
          wlProject.listedWl+= item.quantity;
          await wlProject.save();
        } else {
          res.status(500).json({ success: false, error: "Project not found." });
        }
      })
      const newOrder = {
        walletAddress: address,
        discordID: discordID,
        orderDate: new Date(),
        totalClank: clankCost,
        totalEther: etherCost,
        whitelist: whitelist,
        orderNumber: lastNumber + 1,
      }
      const newUser = new User({
        user_id: userNum + 1,
        address: owner,
        orders: [newOrder],
        lastUpdate: new Date()
      });
      newUser.save();
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
})
router.post("/address/insert", async (req, res) => {
  const owner = req.body.owner;
  const address = req.body.address;
  const project = req.body.project;
  const image = req.body.image;
  const quantity = req.body.quantity;
  const discordID = req.body.discordID;
  const etherCost = req.body.etherCost;
  const clankCost = req.body.clankCost;

  const userNum = await User.countDocuments();
  console.log("===========", userNum);
  let lastNumber;
  if (userNum == 0){
    lastNumber = 0;
  }else{
    const lastUser = await User.find().sort({lastUpdate: "asc"}).skip(userNum - 1);
    lastNumber =lastUser[0].orders[lastUser[0].orders.length-1].orderNumber
  }
  console.log("-------------")
  try {
    const user = await User.findOne({ address: owner });
    if (user){
      const orders = user.orders;
      const newWL = {
        whitelistPicture: image,
        whitelistName: project,
        quantity: quantity,
        etherCost: etherCost,
        clankCost: clankCost,
      }
      console.log(newWL)
      const newOrder = {
        walletAddress: address,
        discordID: discordID,
        orderDate: new Date(),
        totalEther: etherCost,
        totalClank: clankCost,
        orderNumber: lastNumber + 1,
        whitelist: [newWL]
      }
      console.log(newOrder)
      user.lastUpdate = new Date();
      orders.push(newOrder);
      user.save();
    }
    else{
      const newWL = {
        whitelistPicture: image,
        whitelistName: project,
        quantity: quantity,
        etherCost: etherCost,
        clankCost: clankCost,
      }
      const newOrder = {
        walletAddress: address,
        discordID: discordID,
        orderDate: new Date(),
        totalEther: etherCost,
        totalClank: clankCost,
        orderNumber: lastNumber + 1,
        whitelist: [newWL]
      }
      const newUser = new User({
        user_id: userNum + 1,
        address: owner,
        lastUpdate: new Date(),
        orders: [newOrder]
      });
      newUser.save();
    }
    
    const wlProject =await Project.findOne({
      projectName: project,
    });
    console.log(wlProject)
    if (wlProject) {
      wlProject.listedWl+= quantity;
      await wlProject.save();
    } else {
      res.status(500).json({ success: false, error: "Project not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
module.exports = router;
