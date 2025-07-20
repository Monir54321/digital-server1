const axios = require("axios");

class WhatsAppNotificationService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || "https://api.whatsapp.com/v1";
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  // Send message to customer
  async sendMessageToCustomer(phoneNumber, message, orderId = null) {
    try {
      const payload = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: message,
        },
      };

      if (orderId) {
        payload.text.body += `\n\nOrder ID: ${orderId}`;
      }

      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Message sent to customer:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending message to customer:", error);
      throw error;
    }
  }

  // Send order confirmation to customer
  async sendOrderConfirmation(
    customerPhone,
    customerName,
    orderId,
    orderType,
    price
  ) {
    const message = `🎉 *Order Confirmed!*

Hello ${customerName},

Your order has been successfully created and is being processed.

*Order Details:*
• Order ID: ${orderId}
• Service: ${orderType}
• Price: ৳${price}

We will notify you once your order is assigned to a seller and when it's completed.

Thank you for choosing our service! 🙏`;

    return await this.sendMessageToCustomer(customerPhone, message, orderId);
  }

  // Send order status update to customer
  async sendOrderStatusUpdate(
    customerPhone,
    customerName,
    orderId,
    status,
    additionalInfo = ""
  ) {
    let statusMessage = "";

    switch (status) {
      case "FORWARDED_TO_SELLER":
        statusMessage =
          "Your order has been forwarded to a seller and is being processed.";
        break;
      case "SELLER_ACCEPTED":
        statusMessage =
          "Great news! A seller has accepted your order and is working on it.";
        break;
      case "SELLER_REJECTED":
        statusMessage =
          "Unfortunately, the seller has rejected your order. We will assign it to another seller.";
        break;
      case "COMPLETED":
        statusMessage = "🎉 Your order has been completed successfully!";
        break;
      case "CANCELLED":
        statusMessage = "Your order has been cancelled.";
        break;
      default:
        statusMessage = "Your order status has been updated.";
    }

    const message = `📱 *Order Status Update*

Hello ${customerName},

${statusMessage}

*Order Details:*
• Order ID: ${orderId}
• Status: ${status}
${additionalInfo ? `• Additional Info: ${additionalInfo}` : ""}

Thank you for your patience! 🙏`;

    return await this.sendMessageToCustomer(customerPhone, message, orderId);
  }

  // Send order notification to seller
  async sendOrderToSeller(sellerPhone, orderData) {
    let attachmentInfo = "";

    // Add attachment information if files are present
    if (orderData.attachments && orderData.attachments.length > 0) {
      attachmentInfo = "\n\n*Attachments:*\n";
      orderData.attachments.forEach((file, index) => {
        attachmentInfo += `• ${file.fileName} (${file.fileType})\n`;
      });
      attachmentInfo += `\n*Download files:* ${
        process.env.BASE_URL || "https://your-domain.com"
      }${orderData.attachments[0].fileUrl}`;
    }

    const message = `🆕 *New Order Received*

You have received a new order request.

*Order Details:*
• Order ID: ${orderData.orderId}
• Customer: ${orderData.customerName}
• Phone: ${orderData.customerPhone}
• Service: ${orderData.orderType}
• Price: ৳${orderData.price}

*Order Information:*
${this.formatOrderDetails(orderData.orderDetails)}${attachmentInfo}

Please respond with:
✅ *ACCEPT* - to accept the order
❌ *REJECT* - to reject the order

Reply with your decision within 30 minutes.`;

    return await this.sendMessageToCustomer(
      sellerPhone,
      message,
      orderData.orderId
    );
  }

  // Send seller response confirmation
  async sendSellerResponseConfirmation(
    sellerPhone,
    orderId,
    response,
    customerName
  ) {
    const responseText = response === "ACCEPTED" ? "accepted" : "rejected";
    const emoji = response === "ACCEPTED" ? "✅" : "❌";

    const message = `${emoji} *Order ${responseText.toUpperCase()}*

Order ID: ${orderId}
Customer: ${customerName}

Your response has been recorded. ${
      response === "ACCEPTED"
        ? "Please complete the order as soon as possible."
        : "The order will be assigned to another seller."
    }

Thank you! 🙏`;

    return await this.sendMessageToCustomer(sellerPhone, message, orderId);
  }

  // Format order details for display
  formatOrderDetails(orderDetails) {
    let formatted = "";

    if (typeof orderDetails === "object") {
      Object.entries(orderDetails).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          formatted += `• ${key}: ${value}\n`;
        }
      });
    } else {
      formatted = `• Details: ${orderDetails}\n`;
    }

    return formatted || "• No additional details provided";
  }

  // Send welcome message to new customer
  async sendWelcomeMessage(customerPhone, customerName) {
    const message = `👋 *Welcome to Our Service!*

Hello ${customerName},

Thank you for contacting us! We're here to help you with various services including:

📋 NID Services
💳 bKash Services
📞 Call List Services
📄 Document Services
🔐 Biometric Services
💰 Recharge Services

To place an order, please provide:
1. Your name
2. Service type
3. Required details
4. Any additional information

Our team will process your request and get back to you shortly! 🙏

*For support, contact us anytime.*`;

    return await this.sendMessageToCustomer(customerPhone, message);
  }

  // Send order completion notification
  async sendOrderCompletion(
    customerPhone,
    customerName,
    orderId,
    completionDetails = ""
  ) {
    const message = `🎉 *Order Completed Successfully!*

Hello ${customerName},

Your order has been completed successfully!

*Order Details:*
• Order ID: ${orderId}
• Status: ✅ Completed

${completionDetails ? `*Completion Details:*\n${completionDetails}\n` : ""}

Thank you for choosing our service! We hope you're satisfied with the results.

*Please rate our service and provide feedback.* 🙏`;

    return await this.sendMessageToCustomer(customerPhone, message, orderId);
  }

  // Send reminder to seller
  async sendSellerReminder(sellerPhone, orderId, customerName) {
    const message = `⏰ *Order Reminder*

Order ID: ${orderId}
Customer: ${customerName}

This order is still pending your response. Please respond with ACCEPT or REJECT within the next 15 minutes.

If no response is received, the order will be automatically reassigned to another seller.

Thank you! 🙏`;

    return await this.sendMessageToCustomer(sellerPhone, message, orderId);
  }

  // Send simple order confirmation (just order ID)
  async sendSimpleOrderConfirmation(customerPhone, orderId) {
    const message = `📋 ${orderId}`;
    return await this.sendMessageToCustomer(customerPhone, message);
  }

  // Send success status (checkmark only)
  async sendSuccessStatus(customerPhone, orderId) {
    const message = `✅ ${orderId}`;
    return await this.sendMessageToCustomer(customerPhone, message);
  }

  // Send rejection status (close mark only)
  async sendRejectionStatus(customerPhone, orderId) {
    const message = `❌ ${orderId}`;
    return await this.sendMessageToCustomer(customerPhone, message);
  }
}

module.exports = new WhatsAppNotificationService();
