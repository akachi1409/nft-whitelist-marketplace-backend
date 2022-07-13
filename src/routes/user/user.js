/* eslint-disable max-len */
const { Router } = require("express");
const router = new Router({ mergeParams: true });
const User = require("../../models/User");
const path = require("path");

router.get("/address/:address", async (req, res) => {
  const address = req.params.address;
  try {
    const user = await User.findOne({ address: address });
    res.json({success: true, user: user})
  } catch (err) {
    console.log("Error getting an asset from user assets");
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


module.exports = router;