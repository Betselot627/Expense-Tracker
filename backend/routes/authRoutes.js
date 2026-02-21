const express = require("express");
const {
  registerUser,
  getUserInfo,
  loginUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const uploadFiles = require("../middleware/uploadMiddleware");
const User = require("../models/User"); // move to top
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.post(
  "/upload-image",
  protect,
  uploadFiles("profileImages").single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profileImageURL = `/uploads/profileImages/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profileImageURL },
        { new: true }
      );

      res.status(200).json({
        message: "Profile image uploaded successfully",
        profileImageURL,
        user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
