const {Router} = require('express');
const router = new Router();
const userRouter = require("./user/user")

router.use("/user", userRouter);
module.exports = router;