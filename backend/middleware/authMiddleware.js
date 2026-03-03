const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      console.log("Token received, verifying...");

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Token verified for user ID:", decoded.id);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("User not found for token:", decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("User authenticated:", req.user._id);

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No token provided in request");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
