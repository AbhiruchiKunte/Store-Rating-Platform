const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const { verifyToken, isStoreOwner } = require("../middleware/authMiddleware");

router.use(verifyToken, isStoreOwner);

router.get("/dashboard", ownerController.getStoreDashboard);

module.exports = router;
