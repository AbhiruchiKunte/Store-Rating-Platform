const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isNormalUser } = require("../middleware/authMiddleware");

router.use(verifyToken, isNormalUser);

router.get("/stores", userController.getStores);
router.post("/rating", userController.submitRating);
router.put("/rating", userController.modifyRating);

module.exports = router;
