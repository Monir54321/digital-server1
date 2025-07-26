const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// POST /api/orders
router.post("/", orderController.createOrder);

// POST /api/orders/seller-response
router.post("/seller-response", orderController.sellerResponse);

router.patch("/:orderNumber/store-message-id", orderController.storeMessageId);

router.post("/find-buyer", orderController.findBuyer);

module.exports = router;
