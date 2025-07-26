const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
});

const messageMap = {};
 
const markSeen = async (message) => {
  try {
    const chat = await message.getChat();

    // Delay slightly to ensure WhatsApp is ready
    setTimeout(async () => {
      try {
        await chat.sendSeen();
      } catch (err) {
        console.error("Failed to mark as seen:", err.message);
      }
    }, 500);
  } catch (err) {
    console.error("Error in markSeen:", err.message);
  }
};

const getBuyerByOrderNumber = async (orderNumber) => {
  const order = await Order.findOne({ orderNumber });
  if (!order) {
    console.log("❌ No order found for number:", orderNumber);
    throw new Error("Order not found");
  }
  return order.buyer;
};

// Scan QR Code
client.on("qr", (qr) => {
  console.log("📲 Scan this QR code to log in:");
  require("qrcode-terminal").generate(qr, { small: true });
});

// Bot ready
client.on("ready", () => {
  console.log("✅ WhatsApp Bot is ready!");
});

// Hardcoded seller number for testing
const hardcodedSellerNumber = "8801958052026";

// Handle buyer messages
client.on("message", async (message) => {
  if (message.fromMe) return;
  markSeen(message);

  const sellerJid = `${hardcodedSellerNumber}@c.us`;
  const isFromSeller = message.from === sellerJid;

  // 🟢 Case 1: Buyer sending a message
  if (!isFromSeller) {
    if (message.hasMedia) {
      return; // Don’t forward buyer media
    }

    try {
      // Save order to backend

      // ✅ Forward text to seller only once
      const chat = await message.getChat();

      const forwardedMsg = await client.sendMessage(
        sellerJid,
        `\n${message.body}`
      );

      // 2. Store mapping (for reactions)

      // 3. Save both message IDs in database
      const response = await axios.post("http://localhost:3000/orders", {
        buyer: message.from,
        text: message.body,
        forwardedMessageId: message.id._serialized, // original buyer msg id
        sellerForwardedId: forwardedMsg.id._serialized, // forwarded msg id
      });

      const { order } = response.data;

      await chat.sendSeen();
    } catch (err) {
      console.error("❌ Error saving order:", err.message);
    }
  }

  // 🟢 Case 2: Seller sending PDF/media
  else {
    if (!message.hasMedia) {
      return; // Don’t process seller text
    }

    const media = await message.downloadMedia();
    await client.sendSeen(message.from);
    // Extract order number
    const orderNumberMatch = message.body?.match(/\d+/);
    const orderNumber = orderNumberMatch ? orderNumberMatch[0] : null;

    if (!orderNumber) {
      return;
    }

    // Save PDF
    const pdfFolder = path.join(__dirname, "..", "pdfs");
    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder, { recursive: true });
    }

    const fileName = `${orderNumber}_${media.filename}`;
    const filePath = path.join(pdfFolder, fileName);
    fs.writeFileSync(filePath, media.data, "base64");

    try {
      // Notify backend
      const response = await axios.post(
        "http://localhost:3000/orders/seller-response",
        {
          orderNumber,
          pdfFileName: fileName,
          seller: message.from,
        }
      );

      const { buyer } = response.data.order;

      if (buyer) {
        // Forward PDF to buyer
        await client.sendMessage(buyer, media);
      } else {
      }
    } catch (err) {
      console.error("❌ Error processing seller response:", err.message);
    }
  }
});

client.on("message_reaction", async (reaction) => {
  const sellerJid = `${hardcodedSellerNumber}@c.us`;
  const sender = reaction.id.participant || reaction.id.remote;

  // Only process reactions sent by seller
  if (sender !== sellerJid) {
    return;
  }

  try {
    const originalMsg = await client.getMessageById(reaction.msgId._serialized);

    // First, check if we have it in memory
    let buyerMsgId = messageMap[originalMsg.id._serialized];
    let buyer;

    if (!buyerMsgId) {
      // If no mapping in memory, check backend
      console.log("📡 No mapping found. Calling backend /orders/find-buyer...");

      const res = await axios.post("http://localhost:3000/orders/find-buyer", {
        forwardedMessageId: originalMsg.id._serialized, // sellerForwardedId
      });

      buyer = res.data?.buyer;
      buyerMsgId = res.data?.buyerMsgId; // NOTE: must match API response field

      if (!buyer || !buyerMsgId) {
        return;
      }
    }

    // Fetch the buyer's original message using ID
    const buyerMsg = await client.getMessageById(buyerMsgId);
    if (!buyerMsg) {
      return;
    }

    // Extract emoji from reaction
    const emoji =
      typeof reaction.reaction === "string"
        ? reaction.reaction
        : reaction.reaction?.toString?.() || "";

    if (!emoji) {
      return;
    }

    await buyerMsg.react(emoji);
  } catch (err) {
    console.error("❌ Error forwarding reaction:", err.message);
  }
});

// Start the WhatsApp bot
client.initialize();

module.exports = client;
