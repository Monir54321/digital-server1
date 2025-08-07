const express = require("express");
const router = express.Router();
const { sendOrderNotification } = require("../bot/whatsapp");

// POST /api/notify-order
router.post("/notify-order", async (req, res) => {
  try {
    const { orderNumber, customerName, details } = req.body;
    if (!orderNumber || !customerName) {
      return res
        .status(400)
        .json({ error: "orderNumber and customerName are required" });
    }
    await sendOrderNotification(orderNumber, customerName, details);
    res.json({ success: true, message: "Notification sent to WhatsApp" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
