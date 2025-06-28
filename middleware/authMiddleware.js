const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "Access denied. No token provided or invalid format",
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user exists in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid token. User not found",
      });
    }

    // Add user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid token",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "Failed",
        message: "Token expired",
      });
    }

    res.status(500).json({
      status: "Failed",
      message: "Server error during authentication",
    });
  }
};

module.exports = authMiddleware;
