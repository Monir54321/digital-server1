const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// POST /api/orders
router.post("/", orderController.createOrder);

// POST /api/orders/seller-response
router.post("/seller-response", orderController.sellerResponse);

module.exports = router;
