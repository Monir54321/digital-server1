const WhatsAppOrder = require("../models/WhatsAppOrder");
const Seller = require("../models/Seller");
const whatsAppNotification = require("./whatsappNotification.service");

class SimpleAutomationService {
  // Generate unique order ID
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `WO${timestamp}${random}`;
  }

  // Simple one-click order processing
  async processOrder(orderData) {
    try {
      console.log("🚀 Processing order automatically...");

      // Step 1: Create order with generated orderId
      const order = await WhatsAppOrder.create({
        orderId: this.generateOrderId(),
        customerPhone: orderData.customerPhone,
        customerName: orderData.customerName,
        orderType: orderData.orderType,
        orderDetails: orderData.orderDetails || {},
        price: orderData.price || 0,
        status: "PENDING",
        source: "API", // Using valid enum value
      });

      // Step 2: Find available seller
      const seller = await Seller.findOne({
        status: "ACTIVE",
        availability: "AVAILABLE",
      });

      if (!seller) {
        throw new Error("No available sellers found");
      }

      // Step 3: Forward order to seller
      await this.forwardToSeller(order, seller);

      // Step 4: Send confirmation to customer
      await this.sendCustomerConfirmation(order);

      return {
        success: true,
        orderId: order.orderId,
        sellerPhone: seller.phone,
        message: "Order processed and forwarded to seller",
      };
    } catch (error) {
      console.error("Automation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Forward order to seller via WhatsApp
  async forwardToSeller(order, seller) {
    try {
      const message = `🆕 New Order Received!

Order ID: ${order.orderId}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Type: ${order.orderType}
Price: ${order.price}৳

Details: ${JSON.stringify(order.orderDetails)}

Reply with:
✅ ACCEPT - to accept the order
❌ REJECT - to reject the order`;

      await whatsAppNotification.sendMessage(seller.phone, message);

      // Update order with seller info
      await WhatsAppOrder.findByIdAndUpdate(order._id, {
        sellerPhone: seller.phone,
        status: "FORWARDED_TO_SELLER",
        forwardedToSeller: true,
      });

      console.log(`📤 Order forwarded to seller: ${seller.phone}`);
    } catch (error) {
      console.error("Error forwarding to seller:", error);
      throw error;
    }
  }

  // Send confirmation to customer
  async sendCustomerConfirmation(order) {
    try {
      const message = `✅ Your order has been received!

Order ID: ${order.orderId}
Type: ${order.orderType}
Price: ${order.price}৳

We'll notify you once a seller accepts your order.`;

      await whatsAppNotification.sendMessage(order.customerPhone, message);
      console.log(`📱 Confirmation sent to customer: ${order.customerPhone}`);
    } catch (error) {
      console.error("Error sending customer confirmation:", error);
    }
  }

  // Handle seller response (accept/reject)
  async handleSellerResponse(
    orderId,
    sellerPhone,
    response,
    sellerMessage = ""
  ) {
    try {
      const order = await WhatsAppOrder.findOne({ orderId });
      if (!order) {
        throw new Error("Order not found");
      }

      if (response === "ACCEPT") {
        // Update order status
        await WhatsAppOrder.findByIdAndUpdate(order._id, {
          status: "SELLER_ACCEPTED",
          sellerResponse: "ACCEPTED",
          sellerMessage: sellerMessage,
          sellerResponseTime: new Date(),
        });

        // Send acceptance to customer
        const customerMessage = `✅ Your order has been accepted!

Order ID: ${order.orderId}
Seller will contact you soon.`;

        await whatsAppNotification.sendMessage(
          order.customerPhone,
          customerMessage
        );

        // Send seller the customer details
        const sellerDetailsMessage = `✅ Order Accepted!

Customer: ${order.customerName}
Phone: ${order.customerPhone}
Order Details: ${JSON.stringify(order.orderDetails)}

Contact the customer to proceed.`;

        await whatsAppNotification.sendMessage(
          sellerPhone,
          sellerDetailsMessage
        );
      } else if (response === "REJECT") {
        // Update order status
        await WhatsAppOrder.findByIdAndUpdate(order._id, {
          status: "SELLER_REJECTED",
          sellerResponse: "REJECTED",
          sellerMessage: sellerMessage,
          sellerResponseTime: new Date(),
        });

        // Send rejection to customer
        const customerMessage = `❌ Your order has been rejected.

Order ID: ${order.orderId}
We'll try to find another seller for you.`;

        await whatsAppNotification.sendMessage(
          order.customerPhone,
          customerMessage
        );
      }

      return {
        success: true,
        message: `Order ${response.toLowerCase()} successfully`,
      };
    } catch (error) {
      console.error("Error handling seller response:", error);
      return { success: false, error: error.message };
    }
  }

  // Auto-forward PDF/file from customer to seller
  async forwardFileToSeller(customerPhone, fileUrl, fileName) {
    try {
      // Find the customer's active order
      const order = await WhatsAppOrder.findOne({
        customerPhone: customerPhone,
        status: { $in: ["PENDING", "FORWARDED_TO_SELLER", "SELLER_ACCEPTED"] },
      });

      if (!order || !order.sellerPhone) {
        throw new Error("No active order or seller found");
      }

      // Forward file to seller
      await whatsAppNotification.sendFile(
        order.sellerPhone,
        fileUrl,
        fileName,
        `📎 File from customer ${order.customerName} (${customerPhone})`
      );

      console.log(`📎 File forwarded to seller: ${order.sellerPhone}`);
      return { success: true, message: "File forwarded to seller" };
    } catch (error) {
      console.error("Error forwarding file:", error);
      return { success: false, error: error.message };
    }
  }

  // Auto-forward seller response to customer
  async forwardSellerResponseToCustomer(sellerPhone, customerPhone, message) {
    try {
      // Find the order
      const order = await WhatsAppOrder.findOne({
        sellerPhone: sellerPhone,
        customerPhone: customerPhone,
        status: { $in: ["SELLER_ACCEPTED", "COMPLETED"] },
      });

      if (!order) {
        throw new Error("No active order found");
      }

      // Forward message to customer
      await whatsAppNotification.sendMessage(
        customerPhone,
        `💬 Message from seller:\n\n${message}`
      );

      console.log(`💬 Seller response forwarded to customer: ${customerPhone}`);
      return { success: true, message: "Response forwarded to customer" };
    } catch (error) {
      console.error("Error forwarding seller response:", error);
      return { success: false, error: error.message };
    }
  }

  // Get automation status
  getStatus() {
    return {
      isRunning: true,
      timestamp: new Date().toISOString(),
    };
  }

  // Test the automation
  async testAutomation() {
    const testOrder = {
      customerPhone: "+8801712345678",
      customerName: "Test Customer",
      orderType: "NID_ORDER",
      orderDetails: { nidNumber: "1234567890" },
      price: 100,
    };

    return await this.processOrder(testOrder);
  }
}

module.exports = new SimpleAutomationService();
