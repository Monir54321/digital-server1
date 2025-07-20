const {
  createWhatsAppOrderService,
  getWhatsAppOrderByIdService,
  handleSellerResponseService,
  getAvailableSellersService,
  forwardOrderToSellerService,
  updateOrderStatusService,
} = require("../services/whatsappOrder.services");

const { getSellerByPhoneService } = require("../services/seller.services");

const whatsAppNotification = require("../services/whatsappNotification.service");

const Seller = require("../models/Seller");
const WhatsAppOrder = require("../models/WhatsAppOrder");

// In-memory map for customer-seller links (for demo; use DB in production)
const customerSellerMap = new Map();
const sellerCustomerMap = new Map();

// Helper: assign a seller (first available)
async function assignSeller() {
  const seller = await Seller.findOne({
    status: "ACTIVE",
    availability: "AVAILABLE",
  });
  return seller;
}

// Webhook: process any WhatsApp message (text or media)
exports.processWhatsAppMessage = async (req, res) => {
  try {
    const { body } = req;
    const messageData = extractMessageData(body);
    if (!messageData) return res.status(200).json({ status: "ok" });
    const { from, message, mediaUrl, mediaType } = messageData;

    // Is this a seller?
    const seller = await Seller.findOne({ phone: from });
    if (seller) {
      // Seller reply: relay to customer
      const customerPhone = sellerCustomerMap.get(from);
      if (customerPhone) {
        if (mediaUrl) {
          await whatsAppNotification.sendFile(
            customerPhone,
            mediaUrl,
            message || "File from seller"
          );
        } else {
          await whatsAppNotification.sendMessage(customerPhone, message);
        }
      }
      return res.status(200).json({ status: "ok" });
    }

    // Customer message: assign seller if new
    let assignedSeller = customerSellerMap.get(from);
    if (!assignedSeller) {
      assignedSeller = await assignSeller();
      if (!assignedSeller) return res.status(200).json({ status: "no_seller" });
      customerSellerMap.set(from, assignedSeller.phone);
      sellerCustomerMap.set(assignedSeller.phone, from);
    }
    // Relay to seller
    if (mediaUrl) {
      await whatsAppNotification.sendFile(
        assignedSeller.phone,
        mediaUrl,
        message || "File from customer"
      );
    } else {
      await whatsAppNotification.sendMessage(assignedSeller.phone, message);
    }
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Relay error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
};

// Helper: extract message data (text or media)
function extractMessageData(body) {
  // This function should extract: from, message, mediaUrl, mediaType
  // Example for Twilio/Meta webhook structure:
  // (You may need to adjust this for your provider)
  try {
    const entry = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry) return null;
    const from = entry.from;
    let message = entry.text?.body || "";
    let mediaUrl = null;
    let mediaType = null;
    if (entry.type === "document" && entry.document) {
      mediaUrl = entry.document.link;
      mediaType = entry.document.mime_type;
      message = entry.document.caption || message;
    } else if (entry.type === "image" && entry.image) {
      mediaUrl = entry.image.link;
      mediaType = entry.image.mime_type;
      message = entry.image.caption || message;
    }
    return { from, message, mediaUrl, mediaType };
  } catch {
    return null;
  }
}

// Process incoming WhatsApp messages with media
exports.processWhatsAppMessageWithMedia = async (req, res) => {
  try {
    const { body } = req;

    // Verify webhook signature
    if (!verifyWebhookSignature(req)) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Extract message data including media
    const messageData = extractMessageDataWithMedia(body);

    if (!messageData) {
      return res.status(200).json({ status: "ok" });
    }

    const { from, message, timestamp, mediaFiles } = messageData;

    // Check if this is a seller response
    const seller = await getSellerByPhoneService(from);
    if (seller) {
      await handleSellerMessage(from, message, seller);
    } else {
      // This is a customer message with potential media
      await handleCustomerMessageWithMedia(from, message, mediaFiles);
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error processing WhatsApp message with media:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handle customer messages
async function handleCustomerMessage(customerPhone, message) {
  try {
    // Parse the message to extract order information
    const orderInfo = parseCustomerMessage(message);

    if (!orderInfo) {
      // Send welcome message for unrecognized messages
      await whatsAppNotification.sendWelcomeMessage(customerPhone, "Customer");
      return;
    }

    // Create order in database
    const orderData = {
      customerPhone,
      customerName: orderInfo.customerName,
      orderType: orderInfo.orderType,
      orderDetails: orderInfo.orderDetails,
      price: orderInfo.price || 0,
      customerMessage: message,
      source: "WHATSAPP",
    };

    const order = await createWhatsAppOrderService(orderData);

    // Send order confirmation to customer
    await whatsAppNotification.sendOrderConfirmation(
      customerPhone,
      orderInfo.customerName,
      order.orderId,
      orderInfo.orderType,
      order.price
    );

    // Find available sellers and forward order
    await forwardOrderToAvailableSeller(order);
  } catch (error) {
    console.error("Error handling customer message:", error);
    // Send error message to customer
    await whatsAppNotification.sendMessageToCustomer(
      customerPhone,
      "Sorry, there was an error processing your request. Please try again later."
    );
  }
}

// Handle customer messages with media files
async function handleCustomerMessageWithMedia(
  customerPhone,
  message,
  mediaFiles = []
) {
  try {
    // Only process if PDF files are uploaded
    const pdfFiles = mediaFiles.filter(
      (file) =>
        file.mime_type === "application/pdf" ||
        file.filename.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length === 0) {
      // No PDF uploaded - don't send any message
      console.log("No PDF uploaded, ignoring message");
      return;
    }

    // Parse the message to extract order information
    const orderInfo = parseCustomerMessage(message);

    if (!orderInfo) {
      // No valid order info - don't send any message
      console.log("No valid order info found, ignoring message");
      return;
    }

    // Create order in database with PDF files
    const orderData = {
      customerPhone,
      customerName: orderInfo.customerName,
      orderType: orderInfo.orderType,
      orderDetails: orderInfo.orderDetails,
      price: orderInfo.price || 0,
      customerMessage: message,
      source: "WHATSAPP",
    };

    // Process PDF files only
    const processedFiles = await processMediaFiles(pdfFiles);

    const order = await createWhatsAppOrderWithFilesService(
      orderData,
      processedFiles
    );

    // Send only a simple confirmation (no long message)
    await whatsAppNotification.sendSimpleOrderConfirmation(
      customerPhone,
      order.orderId
    );

    // Find available sellers and forward order
    await forwardOrderToAvailableSeller(order);
  } catch (error) {
    console.error("Error handling customer message with media:", error);
    // Don't send error message - just ignore
  }
}

// Handle seller messages
async function handleSellerMessage(sellerPhone, message, seller) {
  try {
    // Parse seller response
    const response = parseSellerResponse(message);

    if (!response) {
      return;
    }

    // Extract order ID from message
    const orderId = extractOrderIdFromMessage(message);

    if (!orderId) {
      await whatsAppNotification.sendMessageToCustomer(
        sellerPhone,
        "Please include the Order ID in your response."
      );
      return;
    }

    // Get order details
    const order = await getWhatsAppOrderByIdService(orderId);

    if (!order) {
      await whatsAppNotification.sendMessageToCustomer(
        sellerPhone,
        "Order not found. Please check the Order ID."
      );
      return;
    }

    // Handle seller response
    const updatedOrder = await handleSellerResponseService(
      orderId,
      response.action,
      response.message
    );

    // Send confirmation to seller
    await whatsAppNotification.sendSellerResponseConfirmation(
      sellerPhone,
      orderId,
      response.action,
      order.customerName
    );

    // Send only status indicator to customer (no text)
    if (response.action === "ACCEPTED") {
      await whatsAppNotification.sendSuccessStatus(
        order.customerPhone,
        orderId
      );
    } else if (response.action === "REJECTED") {
      await whatsAppNotification.sendRejectionStatus(
        order.customerPhone,
        orderId
      );
    }

    // If seller rejected, try to forward to another seller
    if (response.action === "REJECTED") {
      await forwardOrderToAvailableSeller(order);
    }
  } catch (error) {
    console.error("Error handling seller message:", error);
    await whatsAppNotification.sendMessageToCustomer(
      sellerPhone,
      "Sorry, there was an error processing your response. Please try again."
    );
  }
}

// Forward order to available seller
async function forwardOrderToAvailableSeller(order) {
  try {
    const availableSellers = await getAvailableSellersService(order.orderType);

    if (availableSellers.length === 0) {
      // No sellers available, update order status
      await updateOrderStatusService(order.orderId, "PENDING", {
        notes: "No sellers available at the moment",
      });
      return;
    }

    // Select the best seller (highest rating, fastest response time)
    const selectedSeller = availableSellers[0];

    // Forward order to seller
    await forwardOrderToSellerService(order.orderId, selectedSeller.phone);

    // Send order notification to seller
    await whatsAppNotification.sendOrderToSeller(selectedSeller.phone, order);

    // Send status update to customer
    await whatsAppNotification.sendOrderStatusUpdate(
      order.customerPhone,
      order.customerName,
      order.orderId,
      "FORWARDED_TO_SELLER"
    );
  } catch (error) {
    console.error("Error forwarding order to seller:", error);
  }
}

// Parse customer message to extract order information
function parseCustomerMessage(message) {
  try {
    // This is a simplified parser - you might want to implement more sophisticated NLP
    const messageLower = message.toLowerCase();

    // Check for order keywords
    const orderTypes = {
      nid: "NID_ORDER",
      bikash: "BIKASH_INFO",
      "call list": "CALL_LIST",
      "birth certificate": "BIRTH_CERTIFICATE_FIX",
      biometric: "BIOMETRIC_ORDER",
      nogod: "NOGOD_INFO",
      recharge: "RECHARGE",
      "server copy": "SERVER_COPY",
      "sign copy": "SIGN_COPY",
    };

    let detectedOrderType = null;
    for (const [keyword, orderType] of Object.entries(orderTypes)) {
      if (messageLower.includes(keyword)) {
        detectedOrderType = orderType;
        break;
      }
    }

    if (!detectedOrderType) {
      return null;
    }

    // Extract customer name (simplified)
    const nameMatch = message.match(
      /(?:my name is|i am|name:?)\s*([a-zA-Z\s]+)/i
    );
    const customerName = nameMatch ? nameMatch[1].trim() : "Customer";

    // Extract additional details
    const orderDetails = extractOrderDetails(message, detectedOrderType);

    return {
      customerName,
      orderType: detectedOrderType,
      orderDetails,
      price: 0, // You might want to implement price calculation based on order type
    };
  } catch (error) {
    console.error("Error parsing customer message:", error);
    return null;
  }
}

// Extract order details based on order type
function extractOrderDetails(message, orderType) {
  const details = {};

  switch (orderType) {
    case "NID_ORDER":
      const nidMatch = message.match(/(?:nid|number):?\s*(\d+)/i);
      if (nidMatch) details.nidNumber = nidMatch[1];
      break;

    case "BIKASH_INFO":
      const bikashMatch = message.match(/(?:bikash|number):?\s*(\d+)/i);
      if (bikashMatch) details.bikashNumber = bikashMatch[1];
      break;

    case "CALL_LIST":
      const phoneMatch = message.match(/(?:phone|number):?\s*(\d+)/i);
      if (phoneMatch) details.phoneNumber = phoneMatch[1];
      break;

    default:
      details.additionalInfo = message;
  }

  return details;
}

// Parse seller response
function parseSellerResponse(message) {
  const messageUpper = message.toUpperCase();

  if (
    messageUpper.includes("ACCEPT") ||
    messageUpper.includes("YES") ||
    messageUpper.includes("✅")
  ) {
    return {
      action: "ACCEPTED",
      message: message,
    };
  } else if (
    messageUpper.includes("REJECT") ||
    messageUpper.includes("NO") ||
    messageUpper.includes("❌")
  ) {
    return {
      action: "REJECTED",
      message: message,
    };
  }

  return null;
}

// Extract order ID from message
function extractOrderIdFromMessage(message) {
  const orderIdMatch = message.match(/ORD-\d+-[A-Z0-9]+/);
  return orderIdMatch ? orderIdMatch[0] : null;
}

// Verify webhook signature (implement based on your WhatsApp API provider)
function verifyWebhookSignature(req) {
  // Implement signature verification based on your WhatsApp API provider
  // For now, return true (you should implement proper verification)
  return true;
}

// Extract message data including media from webhook body
function extractMessageDataWithMedia(body) {
  try {
    if (
      body.entry &&
      body.entry[0] &&
      body.entry[0].changes &&
      body.entry[0].changes[0]
    ) {
      const change = body.entry[0].changes[0];

      if (change.value && change.value.messages && change.value.messages[0]) {
        const message = change.value.messages[0];
        const mediaFiles = [];

        // Check for media attachments
        if (message.document) {
          mediaFiles.push({
            id: message.document.id,
            filename: message.document.filename,
            mime_type: message.document.mime_type,
          });
        } else if (message.image) {
          mediaFiles.push({
            id: message.image.id,
            filename: "image.jpg",
            mime_type: message.image.mime_type,
          });
        } else if (message.video) {
          mediaFiles.push({
            id: message.video.id,
            filename: "video.mp4",
            mime_type: message.video.mime_type,
          });
        }

        return {
          from: message.from,
          message: message.text?.body || "",
          timestamp: message.timestamp,
          messageId: message.id,
          mediaFiles: mediaFiles,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting message data with media:", error);
    return null;
  }
}

// Process media files from WhatsApp
async function processMediaFiles(mediaFiles) {
  const processedFiles = [];

  for (const mediaFile of mediaFiles) {
    try {
      // Download file from WhatsApp API
      const fileData = await downloadWhatsAppMedia(mediaFile.id);

      // Save file to local storage
      const fileName = `${Date.now()}_${mediaFile.filename || "whatsapp_file"}`;
      const filePath = `./files/${fileName}`;

      // Write file to disk
      require("fs").writeFileSync(filePath, fileData);

      processedFiles.push({
        originalname: mediaFile.filename || "whatsapp_file",
        filename: fileName,
        mimetype: mediaFile.mime_type,
        path: filePath,
      });
    } catch (error) {
      console.error("Error processing media file:", error);
    }
  }

  return processedFiles;
}

// Download media from WhatsApp API
async function downloadWhatsAppMedia(mediaId) {
  try {
    const response = await axios.get(
      `${process.env.WHATSAPP_API_URL}/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
        },
      }
    );

    const mediaUrl = response.data.url;
    const mediaResponse = await axios.get(mediaUrl, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
      },
      responseType: "arraybuffer",
    });

    return mediaResponse.data;
  } catch (error) {
    console.error("Error downloading WhatsApp media:", error);
    throw error;
  }
}

// Webhook verification endpoint
exports.verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};
