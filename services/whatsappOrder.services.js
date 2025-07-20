const WhatsAppOrder = require("../models/WhatsAppOrder");
const Seller = require("../models/Seller");
const { v4: uuidv4 } = require("uuid");

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Create new WhatsApp order
exports.createWhatsAppOrderService = async (data) => {
  try {
    const orderId = generateOrderId();
    const orderData = {
      ...data,
      orderId,
      status: "PENDING",
    };

    const result = await WhatsAppOrder.create(orderData);
    return result;
  } catch (error) {
    console.error("Error creating WhatsApp order:", error);
    throw error;
  }
};

// Create new WhatsApp order with file attachments
exports.createWhatsAppOrderWithFilesService = async (data, files = []) => {
  try {
    const orderId = generateOrderId();

    // Process file attachments
    const attachments = files.map((file) => ({
      fileName: file.originalname,
      fileUrl: `/files/${file.filename}`,
      fileType: file.mimetype,
    }));

    const orderData = {
      ...data,
      orderId,
      status: "PENDING",
      attachments: attachments,
    };

    const result = await WhatsAppOrder.create(orderData);
    return result;
  } catch (error) {
    console.error("Error creating WhatsApp order with files:", error);
    throw error;
  }
};

// Process WhatsApp message with media
exports.processWhatsAppMessageWithMedia = async (
  messageData,
  mediaFiles = []
) => {
  try {
    const { from, message, timestamp } = messageData;

    // Parse the message to extract order information
    const orderInfo = parseCustomerMessage(message);

    if (!orderInfo) {
      return null;
    }

    // Create order with file attachments
    const orderData = {
      customerPhone: from,
      customerName: orderInfo.customerName,
      orderType: orderInfo.orderType,
      orderDetails: orderInfo.orderDetails,
      price: orderInfo.price || 0,
      customerMessage: message,
      source: "WHATSAPP",
      whatsAppMessageId: messageData.messageId,
    };

    const order = await createWhatsAppOrderWithFilesService(
      orderData,
      mediaFiles
    );
    return order;
  } catch (error) {
    console.error("Error processing WhatsApp message with media:", error);
    throw error;
  }
};

// Get all orders
exports.getAllWhatsAppOrdersService = async (filters = {}) => {
  try {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.orderType) query.orderType = filters.orderType;
    if (filters.customerPhone) query.customerPhone = filters.customerPhone;
    if (filters.dateFrom) {
      query.createdAt = { $gte: new Date(filters.dateFrom) };
    }
    if (filters.dateTo) {
      query.createdAt = { ...query.createdAt, $lte: new Date(filters.dateTo) };
    }

    const result = await WhatsAppOrder.find(query).sort({ createdAt: -1 });
    return result;
  } catch (error) {
    console.error("Error getting WhatsApp orders:", error);
    throw error;
  }
};

// Get order by ID
exports.getWhatsAppOrderByIdService = async (orderId) => {
  try {
    const result = await WhatsAppOrder.findOne({ orderId });
    return result;
  } catch (error) {
    console.error("Error getting WhatsApp order by ID:", error);
    throw error;
  }
};

// Update order status
exports.updateOrderStatusService = async (
  orderId,
  status,
  additionalData = {}
) => {
  try {
    const updateData = { status, ...additionalData };

    if (status === "SELLER_ACCEPTED" || status === "SELLER_REJECTED") {
      updateData.sellerResponseTime = new Date();
    }

    if (status === "COMPLETED") {
      updateData.actualCompletionTime = new Date();
    }

    const result = await WhatsAppOrder.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Forward order to seller
exports.forwardOrderToSellerService = async (orderId, sellerPhone) => {
  try {
    const order = await WhatsAppOrder.findOne({ orderId });
    if (!order) {
      throw new Error("Order not found");
    }

    const seller = await Seller.findOne({
      phone: sellerPhone,
      status: "ACTIVE",
    });
    if (!seller) {
      throw new Error("Seller not found or inactive");
    }

    // Check if seller specializes in this order type
    if (!seller.specialization.includes(order.orderType)) {
      throw new Error("Seller does not specialize in this order type");
    }

    const updateData = {
      status: "FORWARDED_TO_SELLER",
      sellerPhone,
      forwardedToSeller: true,
      sellerNotificationSent: true,
    };

    const result = await WhatsAppOrder.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true }
    );

    // Update seller stats
    await Seller.updateOne(
      { phone: sellerPhone },
      { $inc: { totalOrders: 1 } }
    );

    return result;
  } catch (error) {
    console.error("Error forwarding order to seller:", error);
    throw error;
  }
};

// Handle seller response
exports.handleSellerResponseService = async (
  orderId,
  response,
  message = ""
) => {
  try {
    const order = await WhatsAppOrder.findOne({ orderId });
    if (!order) {
      throw new Error("Order not found");
    }

    let status = "PENDING";
    if (response === "ACCEPTED") {
      status = "SELLER_ACCEPTED";
    } else if (response === "REJECTED") {
      status = "SELLER_REJECTED";
    }

    const updateData = {
      status,
      sellerResponse: response,
      sellerMessage: message,
      sellerResponseTime: new Date(),
    };

    const result = await WhatsAppOrder.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true }
    );

    // Update seller stats
    if (response === "ACCEPTED") {
      await Seller.updateOne(
        { phone: order.sellerPhone },
        { $inc: { completedOrders: 1 } }
      );
    }

    return result;
  } catch (error) {
    console.error("Error handling seller response:", error);
    throw error;
  }
};

// Get available sellers for order type
exports.getAvailableSellersService = async (orderType) => {
  try {
    const sellers = await Seller.find({
      status: "ACTIVE",
      availability: "AVAILABLE",
      specialization: orderType,
    }).sort({ rating: -1, responseTime: 1 });

    return sellers;
  } catch (error) {
    console.error("Error getting available sellers:", error);
    throw error;
  }
};

// Get orders by customer phone
exports.getOrdersByCustomerPhoneService = async (customerPhone) => {
  try {
    const result = await WhatsAppOrder.find({ customerPhone }).sort({
      createdAt: -1,
    });
    return result;
  } catch (error) {
    console.error("Error getting orders by customer phone:", error);
    throw error;
  }
};

// Get orders by seller phone
exports.getOrdersBySellerPhoneService = async (sellerPhone) => {
  try {
    const result = await WhatsAppOrder.find({ sellerPhone }).sort({
      createdAt: -1,
    });
    return result;
  } catch (error) {
    console.error("Error getting orders by seller phone:", error);
    throw error;
  }
};

// Get order statistics
exports.getOrderStatisticsService = async () => {
  try {
    const stats = await WhatsAppOrder.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalOrders = await WhatsAppOrder.countDocuments();
    const todayOrders = await WhatsAppOrder.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    return {
      statusBreakdown: stats,
      totalOrders,
      todayOrders,
    };
  } catch (error) {
    console.error("Error getting order statistics:", error);
    throw error;
  }
};

// Delete order
exports.deleteWhatsAppOrderService = async (orderId) => {
  try {
    const result = await WhatsAppOrder.findOneAndDelete({ orderId });
    return result;
  } catch (error) {
    console.error("Error deleting WhatsApp order:", error);
    throw error;
  }
};

// Mark order as completed
exports.completeOrderService = async (orderId, completionDetails = "") => {
  try {
    const order = await WhatsAppOrder.findOne({ orderId });
    if (!order) {
      throw new Error("Order not found");
    }

    const updateData = {
      status: "COMPLETED",
      actualCompletionTime: new Date(),
      notes: completionDetails,
    };

    const result = await WhatsAppOrder.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true }
    );

    // Send success status to customer
    const whatsAppNotification = require("./whatsappNotification.service");
    await whatsAppNotification.sendSuccessStatus(order.customerPhone, orderId);

    return result;
  } catch (error) {
    console.error("Error completing order:", error);
    throw error;
  }
};
