const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const HardcodedSellerModel = require("../models/hardCoded.model");

// POST /api/orders
router.post("/", orderController.createOrder);

// POST /api/orders/seller-response
router.post("/seller-response", orderController.sellerResponse);

router.patch("/:orderNumber/store-message-id", orderController.storeMessageId);

router.post("/find-buyer", orderController.findBuyer);


// Update seller number
router.put("/update-number", async (req, res) => {
  try {
    const { whatsappNumber } = req.body;

    if (!whatsappNumber) {
      return res.status(400).json({ error: "whatsappNumber is required" });
    }

    let seller = await HardcodedSellerModel.findOne();
    if (!seller) {
      seller = await HardcodedSellerModel.create({ whatsappNumber });
    } else {
      seller.whatsappNumber = whatsappNumber;
      await seller.save(); // FIXED HERE
    }

    return res.json({ message: "Seller number updated successfully", seller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get seller number
router.get("/get-seller-number", async (req, res) => {
  const seller = await HardcodedSellerModel.findOne();
  if (!seller) return res.status(404).json({ error: "No seller number found" });
  res.json({ seller });
});

module.exports = router;
