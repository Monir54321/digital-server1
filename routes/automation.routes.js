const express = require("express");
const router = express.Router();
const automationController = require("../controllers/automation.controller");

// Simple one-click order processing
router.post("/process-order", automationController.processOrder);

// Handle seller response (accept/reject)
router.post("/seller-response", automationController.handleSellerResponse);

// Forward file from customer to seller
router.post("/forward-file", automationController.forwardFileToSeller);

// Forward seller message to customer
router.post("/forward-message", automationController.forwardSellerMessage);

// Get automation status
router.get("/status", automationController.getStatus);

// Test automation
router.post("/test", automationController.testAutomation);

module.exports = router;
