const orderService = require("../services/order.service");

const createOrder = async (req, res) => {
  console.log("📡 [Controller] /api/orders POST called");
  try {
    const { buyer, text } = req.body;
    console.log("📥 Request body:", req.body);

    const order = await orderService.createOrder(buyer, text);
    console.log("✅ Order created successfully");
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.log("❌ Error creating order:", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const sellerResponse = async (req, res) => {
  console.log("📡 [Controller] /api/orders/seller-response POST called");
  try {
    const { orderNumber, pdfFileName, status } = req.body;
    console.log("📥 Request body:", req.body);

    const order = await orderService.processSellerResponse(
      orderNumber,
      pdfFileName,
      status
    );
    console.log("✅ Order updated successfully");
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    console.log("❌ Error processing seller response:", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createOrder,
  sellerResponse,
};
