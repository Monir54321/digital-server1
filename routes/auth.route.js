const express = require("express");
const router = express.Router();
const {
  loginController,
  verifyTokenController,
  signupController,
} = require("../controllers/auth.controller");

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/verify", verifyTokenController);

// Logout route (client-side token removal)
router.post("/logout", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Logout successful. Please remove the token from client storage.",
  });
});

module.exports = router;
