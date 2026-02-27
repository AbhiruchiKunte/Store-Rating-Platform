const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register", authController.signup);
router.post("/login", authController.login);
router.post("/update-password", verifyToken, authController.updatePassword);

module.exports = router;