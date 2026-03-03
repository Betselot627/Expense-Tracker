const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// 🔐 Register User
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, profileImageURL } = req.body;

    console.log("Registration attempt for email:", email);

    // Check if all required fields exist
    if (!fullName || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImageURL: profileImageURL || "",
    });

    console.log("User registered successfully:", user._id);

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔑 Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Login successful for user:", user._id);

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 👤 Get Logged-in User Info
const getUserInfo = async (req, res) => {
  try {
    console.log("Getting user info for:", req.user?.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      console.log("User not found:", req.user?.id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User info retrieved successfully:", user._id);

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
};
