const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Protected route - Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // req.user contains the decoded token information
    const { id, email, role } = req.user;

    res.status(200).json({
      status: "Success",
      message: "Profile retrieved successfully",
      data: {
        id,
        email,
        role,
        message: "This is a protected route - you are authenticated!",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Error retrieving profile",
      error: error.message,
    });
  }
});

// Protected route - Get user dashboard data
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;

    res.status(200).json({
      status: "Success",
      message: "Dashboard data retrieved successfully",
      data: {
        userEmail: email,
        dashboardItems: [
          "Welcome to your dashboard",
          "This is protected content",
          "Only authenticated users can see this",
        ],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Error retrieving dashboard data",
      error: error.message,
    });
  }
});

// Protected route - Update user settings
router.put("/settings", authMiddleware, async (req, res) => {
  try {
    const { id, email } = req.user;
    const { name, number } = req.body;

    // Here you would typically update the user in the database
    // For now, we'll just return a success message

    res.status(200).json({
      status: "Success",
      message: "Settings updated successfully",
      data: {
        userId: id,
        userEmail: email,
        updatedFields: { name, number },
        message: "Settings would be updated in the database",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Error updating settings",
      error: error.message,
    });
  }
});

// Protected route - Get user orders (example)
router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;

    res.status(200).json({
      status: "Success",
      message: "Orders retrieved successfully",
      data: {
        userEmail: email,
        orders: [
          {
            id: "order1",
            type: "NID Order",
            status: "Completed",
            date: "2024-01-15",
          },
          {
            id: "order2",
            type: "Birth Certificate",
            status: "Pending",
            date: "2024-01-20",
          },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Error retrieving orders",
      error: error.message,
    });
  }
});

module.exports = router;
