const Order = require("../models/order.model");
const orderService = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
      const { buyer, text, forwardedMessageId, sellerForwardedId } = req.body;

    const order = await orderService.createOrder(
      buyer,
      text,
      forwardedMessageId,
      sellerForwardedId
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const sellerResponse = async (req, res) => {
  try {
    const { orderNumber, pdfFileName, status } = req.body;

    console.log(req.body);

    const order = await orderService.processSellerResponse(
      orderNumber,
      pdfFileName,
      status
    );

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const storeMessageId = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { buyerMessageId } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { buyerMessageId },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Buyer message ID saved",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const findBuyer = async (req, res) => {
  console.log("📩 /orders/find-buyer API called with body:", req.body);

  try {
    const { forwardedMessageId } = req.body;
    console.log("🔎 Searching order by sellerForwardedId:", forwardedMessageId);

    const order = await Order.findOne({
      sellerForwardedId: forwardedMessageId,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    console.log("✅ Buyer found:", order.buyer);

    return res.status(200).json({
      success: true,
      buyer: order.buyer,
      buyerMsgId: order.forwardedMessageId, // send buyer message ID too
    });
  } catch (err) {
    console.error("❌ Error in findBuyer:", err.message);
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};




module.exports = {
  createOrder,
  sellerResponse,
  storeMessageId,
  findBuyer,
};
