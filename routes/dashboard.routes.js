const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");

// Get dashboard overview
router.get("/overview", dashboardController.getDashboardOverview);

// Get analytics data
router.get("/analytics", dashboardController.getAnalytics);

// Get orders with advanced filtering
router.get("/orders", dashboardController.getOrdersWithFilters);

// Get sellers with advanced filtering
router.get("/sellers", dashboardController.getSellersWithFilters);

// Get customer order history
router.get(
  "/customer/:customerPhone/orders",
  dashboardController.getCustomerOrderHistory
);

// Get seller order history
router.get(
  "/seller/:sellerPhone/orders",
  dashboardController.getSellerOrderHistory
);

module.exports = router;
