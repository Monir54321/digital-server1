const express = require("express");
const router = express.Router();

const whatsAppWebhookController = require("../controllers/whatsappWebhook.controller");

// Webhook verification endpoint
router.get("/", whatsAppWebhookController.verifyWebhook);

// Webhook message processing endpoint
router.post("/", whatsAppWebhookController.processWhatsAppMessage);

module.exports = router;
