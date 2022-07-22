const {Router} = require('express');
const router = new Router();
const userRouter = require("./user/user")
const projectRouter = require("./project/project")

router.use("/user", userRouter);
router.use("/project", projectRouter);
module.exports = router;