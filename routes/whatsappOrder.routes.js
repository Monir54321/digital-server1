const express = require("express");
const router = express.Router();

const whatsAppOrderControllers = require("../controllers/whatsappOrder.controllers");

// Create new order
router.post("/", whatsAppOrderControllers.createWhatsAppOrderController);

// Get all orders with filters
router.get("/", whatsAppOrderControllers.getAllWhatsAppOrdersController);

// Get order statistics
router.get(
  "/statistics",
  whatsAppOrderControllers.getOrderStatisticsController
);

// Get available sellers for order type
router.get(
  "/sellers/:orderType",
  whatsAppOrderControllers.getAvailableSellersController
);

// Get orders by customer phone
router.get(
  "/customer/:customerPhone",
  whatsAppOrderControllers.getOrdersByCustomerPhoneController
);

// Get orders by seller phone
router.get(
  "/seller/:sellerPhone",
  whatsAppOrderControllers.getOrdersBySellerPhoneController
);

// Get order by ID
router.get(
  "/:orderId",
  whatsAppOrderControllers.getWhatsAppOrderByIdController
);

// Update order status
router.patch(
  "/:orderId/status",
  whatsAppOrderControllers.updateOrderStatusController
);

// Forward order to seller
router.post(
  "/:orderId/forward",
  whatsAppOrderControllers.forwardOrderToSellerController
);

// Handle seller response
router.post(
  "/:orderId/seller-response",
  whatsAppOrderControllers.handleSellerResponseController
);

// Delete order
router.delete(
  "/:orderId",
  whatsAppOrderControllers.deleteWhatsAppOrderController
);

module.exports = router;
