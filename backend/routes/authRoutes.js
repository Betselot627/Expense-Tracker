const express = require("express");
const {
  registerUser,
  getUserInfo,
  loginUser,
  googleLogin,
  githubCallback,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const uploadFiles = require("../middleware/uploadMiddleware");
const User = require("../models/User");
const passport = require("../config/passport");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// OAuth routes
router.post("/google", googleLogin);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback,
);
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
        { new: true },
      );

      res.status(200).json({
        message: "Profile image uploaded successfully",
        profileImageURL,
        user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = router;
