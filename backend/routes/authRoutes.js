// routes/authRoutes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const {
  registerUser,
  getUserInfo,
  loginUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const uploadFiles = require("../middleware/uploadMiddleware");
const User = require("../models/User");

const router = express.Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// =========================
// Standard Auth Routes
// =========================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// =========================
// Google OAuth Route
// =========================
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    console.log("Google OAuth request received");

    if (!credential) {
      console.log("No credential provided");
      return res.status(400).json({ message: "No credential provided" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      console.log("Email not provided by Google");
      return res.status(400).json({ message: "Email not provided by Google" });
    }

    // Normalize email
    const email = payload.email.toLowerCase().trim();
    const fullName = payload.name;
    const picture = payload.picture;

    console.log("Google token verified for email:", email);

    // Check if user exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // User exists - link Google account by updating profile image if not set
      console.log("Existing user found, linking Google account:", user._id);

      if (!user.profileImageURL && picture) {
        user.profileImageURL = picture;
        await user.save();
      }
    } else {
      // Create new user with Google info
      console.log("Creating new user with Google account");
      user = await User.create({
        fullName: fullName || email.split("@")[0],
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        profileImageURL: picture || "",
      });
      console.log("New user created:", user._id);
    }

    const token = generateToken(user._id);

    console.log("Google login successful for user:", user._id);

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
});

// =========================
// Profile Image Upload
// =========================
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

      console.log("Profile image uploaded successfully for user:", user._id);

      res.status(200).json({
        message: "Profile image uploaded successfully",
        profileImageURL,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileImageURL: user.profileImageURL,
        },
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = router;
