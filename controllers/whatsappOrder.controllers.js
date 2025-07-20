const {
  createWhatsAppOrderService,
  getAllWhatsAppOrdersService,
  getWhatsAppOrderByIdService,
  updateOrderStatusService,
  forwardOrderToSellerService,
  handleSellerResponseService,
  getAvailableSellersService,
  getOrdersByCustomerPhoneService,
  getOrdersBySellerPhoneService,
  getOrderStatisticsService,
  deleteWhatsAppOrderService,
} = require("../services/whatsappOrder.services");

// Create new WhatsApp order
exports.createWhatsAppOrderController = async (req, res) => {
  try {
    const data = req.body;
    const result = await createWhatsAppOrderService(data);

    res.status(201).json({
      status: "Success",
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get all orders with filters
exports.getAllWhatsAppOrdersController = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getAllWhatsAppOrdersService(filters);

    res.status(200).json({
      status: "Success",
      message: "Orders retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// Get order by ID
exports.getWhatsAppOrderByIdController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await getWhatsAppOrderByIdService(orderId);

    if (!result) {
      return res.status(404).json({
        status: "Failed",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Order retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve order",
      error: error.message,
    });
  }
};

// Update order status
exports.updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, ...additionalData } = req.body;

    const result = await updateOrderStatusService(
      orderId,
      status,
      additionalData
    );

    res.status(200).json({
      status: "Success",
      message: "Order status updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Forward order to seller
exports.forwardOrderToSellerController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { sellerPhone } = req.body;

    const result = await forwardOrderToSellerService(orderId, sellerPhone);

    res.status(200).json({
      status: "Success",
      message: "Order forwarded to seller successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to forward order to seller",
      error: error.message,
    });
  }
};

// Handle seller response
exports.handleSellerResponseController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { response, message } = req.body;

    const result = await handleSellerResponseService(
      orderId,
      response,
      message
    );

    res.status(200).json({
      status: "Success",
      message: "Seller response handled successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to handle seller response",
      error: error.message,
    });
  }
};

// Get available sellers for order type
exports.getAvailableSellersController = async (req, res) => {
  try {
    const { orderType } = req.params;
    const result = await getAvailableSellersService(orderType);

    res.status(200).json({
      status: "Success",
      message: "Available sellers retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve available sellers",
      error: error.message,
    });
  }
};

// Get orders by customer phone
exports.getOrdersByCustomerPhoneController = async (req, res) => {
  try {
    const { customerPhone } = req.params;
    const result = await getOrdersByCustomerPhoneService(customerPhone);

    res.status(200).json({
      status: "Success",
      message: "Customer orders retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve customer orders",
      error: error.message,
    });
  }
};

// Get orders by seller phone
exports.getOrdersBySellerPhoneController = async (req, res) => {
  try {
    const { sellerPhone } = req.params;
    const result = await getOrdersBySellerPhoneService(sellerPhone);

    res.status(200).json({
      status: "Success",
      message: "Seller orders retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve seller orders",
      error: error.message,
    });
  }
};

// Get order statistics
exports.getOrderStatisticsController = async (req, res) => {
  try {
    const result = await getOrderStatisticsService();

    res.status(200).json({
      status: "Success",
      message: "Order statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve order statistics",
      error: error.message,
    });
  }
};

// Delete order
exports.deleteWhatsAppOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await deleteWhatsAppOrderService(orderId);

    if (!result) {
      return res.status(404).json({
        status: "Failed",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Order deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to delete order",
      error: error.message,
    });
  }
};
