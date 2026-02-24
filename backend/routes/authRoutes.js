// routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch"); // for GitHub OAuth
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

// --- Existing Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// --- Google OAuth Route ---
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email not provided by Google" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        fullName: name,
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
        profileImageURL: picture || "",
      });
    }

    const token = generateToken(user._id);

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
    res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
});

// --- GitHub OAuth Route ---
router.post("/github", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });

    // Exchange code for access token
    const tokenRes = await fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken)
      return res.status(400).json({ message: "Failed to get GitHub token" });

    // Fetch user info from GitHub
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const ghUser = await userRes.json();

    if (!ghUser.email) {
      // Sometimes GitHub email is private, fetch via another endpoint
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${accessToken}` },
      });
      const emails = await emailsRes.json();
      ghUser.email = emails.find((e) => e.primary && e.verified)?.email;
    }

    if (!ghUser.email)
      return res.status(400).json({ message: "GitHub email not found" });

    // Check if user exists
    let user = await User.findOne({ email: ghUser.email });
    if (!user) {
      user = await User.create({
        fullName: ghUser.name || ghUser.login,
        email: ghUser.email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        profileImageURL: ghUser.avatar_url || "",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "GitHub login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
      },
    });
  } catch (error) {
    console.error("GitHub login error:", error);
    res.status(500).json({ message: "GitHub authentication failed", error: error.message });
  }
});

// --- Upload Profile Image ---
router.post(
  "/upload-image",
  protect,
  uploadFiles("profileImages").single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

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