const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Apply middleware to all admin routes
router.use(verifyToken, isAdmin);

router.get("/dashboard", adminController.getDashboardStats);
router.post("/users", adminController.addUser);
router.post("/stores", adminController.addStore);
router.get("/users", adminController.getUsers);
router.get("/stores", adminController.getStores);
router.get("/users/:id", adminController.getUserDetails);

module.exports = router;
