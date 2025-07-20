const automationService = require("../services/automation.service");

// Simple one-click order processing
exports.processOrder = async (req, res) => {
  try {
    const orderData = req.body;
    console.log("🚀 Simple automation requested:", orderData);

    const result = await automationService.processOrder(orderData);

    if (result.success) {
      res.status(200).json({
        status: "Success",
        message: "Order processed and forwarded to seller",
        data: result,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Order processing failed",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Automation error:", error);
    res.status(500).json({
      status: "Failed",
      message: "Automation failed",
      error: error.message,
    });
  }
};

// Handle seller response (accept/reject)
exports.handleSellerResponse = async (req, res) => {
  try {
    const { orderId, sellerPhone, response, sellerMessage } = req.body;
    console.log("📱 Seller response:", { orderId, sellerPhone, response });

    const result = await automationService.handleSellerResponse(
      orderId,
      sellerPhone,
      response,
      sellerMessage
    );

    if (result.success) {
      res.status(200).json({
        status: "Success",
        message: result.message,
        data: result,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Failed to handle seller response",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Seller response error:", error);
    res.status(500).json({
      status: "Failed",
      message: "Failed to handle seller response",
      error: error.message,
    });
  }
};

// Forward file from customer to seller
exports.forwardFileToSeller = async (req, res) => {
  try {
    const { customerPhone, fileUrl, fileName } = req.body;
    console.log("📎 Forwarding file:", { customerPhone, fileName });

    const result = await automationService.forwardFileToSeller(
      customerPhone,
      fileUrl,
      fileName
    );

    if (result.success) {
      res.status(200).json({
        status: "Success",
        message: "File forwarded to seller",
        data: result,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Failed to forward file",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("File forwarding error:", error);
    res.status(500).json({
      status: "Failed",
      message: "Failed to forward file",
      error: error.message,
    });
  }
};

// Forward seller message to customer
exports.forwardSellerMessage = async (req, res) => {
  try {
    const { sellerPhone, customerPhone, message } = req.body;
    console.log("💬 Forwarding seller message:", {
      sellerPhone,
      customerPhone,
    });

    const result = await automationService.forwardSellerResponseToCustomer(
      sellerPhone,
      customerPhone,
      message
    );

    if (result.success) {
      res.status(200).json({
        status: "Success",
        message: "Message forwarded to customer",
        data: result,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Failed to forward message",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Message forwarding error:", error);
    res.status(500).json({
      status: "Failed",
      message: "Failed to forward message",
      error: error.message,
    });
  }
};

// Get automation status
exports.getStatus = async (req, res) => {
  try {
    const status = automationService.getStatus();

    res.status(200).json({
      status: "Success",
      message: "Automation status retrieved",
      data: status,
    });
  } catch (error) {
    console.error("Status error:", error);
    res.status(500).json({
      status: "Failed",
      message: "Failed to get automation status",
      error: error.message,
    });
  }
};

// Test automation
exports.testAutomation = async (req, res) => {
  try {
    console.log("🧪 Testing simple automation");

    const result = await automationService.testAutomation();

    if (result.success) {
      res.status(200).json({
        status: "Success",
        message: "Test automation completed",
        data: result,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Test automation failed",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Test automation error:", error);
    res.status(500).json({
      status: "Failed",
      message: "Test automation failed",
      error: error.message,
    });
  }
};
