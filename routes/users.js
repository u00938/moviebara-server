const express = require("express");
const router = express.Router();
const controller = require("../controller/users");
const tokenMiddleware = require("../middleware/token");

router.get("/", tokenMiddleware, controller.get);
router.post("/", controller.signUp);
router.get("/:user_id", tokenMiddleware, controller.getUserById);
router.patch("/", tokenMiddleware, controller.updateUserInfo);
router.post("/verifyPassword", tokenMiddleware, controller.checkPassword);

module.exports = router;
