const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const saltRounds = 10;

exports.loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  // Compare plain text password
  const isMatch = user.password === password;
  if (!isMatch) return null;
  // Exclude password fields from token payload
  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { token, user: payload };
};

exports.verifyTokenService = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

exports.checkUserExistService = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

exports.signupUserService = async (userData) => {
  const { name, email, password, confirmPassword, number } = userData;
  if (!email || !password || !confirmPassword) {
    throw new Error("Email, password, and confirmPassword are required");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const user = await User.create({
    name,
    email,
    password: password,
    confirmPassword: password,
    number,
  });
  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { token, user: payload };
};
