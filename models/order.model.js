const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyer: String, // WhatsApp ID
  orderNumber: String, // First line of message
  name: String, // Second line of message
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  forwardedMessageId: { type: String },
  sellerForwardedId: { type: String },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
