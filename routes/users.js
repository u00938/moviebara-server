const express = require("express");
const router = express.Router();
const controller = require("../controller/users");
const tokenMiddleware = require("../middleware/token");
const multer = require("multer");
const upload = multer();

router.get("/", tokenMiddleware, controller.get);
router.post("/", controller.signUp);
router.get("/:user_id", controller.getUserById);
router.patch(
  "/",
  [tokenMiddleware, upload.single("image")],
  controller.updateUserInfo
);
router.post("/verifyPassword", tokenMiddleware, controller.checkPassword);

module.exports = router;
