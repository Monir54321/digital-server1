const { Client, RemoteAuth } = require("whatsapp-web.js");
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const Order = require("../models/order.model");

const hardcodedSellerNumber = "8801958052026";

const getBuyerByOrderNumber = async (orderNumber) => {
  const order = await Order.findOne({ orderNumber });
  if (!order) {
    console.log("❌ No order found for number:", orderNumber);
    throw new Error("Order not found");
  }
  return order.buyer;
};

async function startBot() {
  try {
    console.log("🚀 Starting WhatsApp bot...");

    // ✅ Check MongoDB Connection
    console.log("🔄 Checking MongoDB connection...");
    if (mongoose.connection.readyState !== 1) {
      console.error(
        "❌ Mongoose is NOT connected! Please connect to MongoDB before starting the bot."
      );
      throw new Error("Mongoose is not connected");
    }
    console.log("✅ MongoDB is connected!");

    // 🔄 Setup WhatsApp Store
    console.log("🔄 Setting up MongoStore...");
    const store = new MongoStore({
      mongoose: mongoose,
      session: "whatsapp-session",
    });
    

  
    const client = new Client({
      authStrategy: new RemoteAuth({
        store,
        backupSyncIntervalMs: 300000,
      }),
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

    // 📲 QR Code Event
    client.on("qr", (qr) => {
      console.log("📲 QR Code received. Scan this to log in:");
      qrcode.generate(qr, { small: true });
    });

    // ✅ Ready Event
    client.on("ready", () => {
      console.log("✅ WhatsApp Bot is ready and connected!");
    });

    // ❌ Disconnected Event
    client.on("disconnected", (reason) => {
      console.error("❌ WhatsApp Bot disconnected. Reason:", reason);
    });

    // 📥 Message Event
    client.on("message", async (message) => {
      if (message.fromMe) return; // Ignore bot’s own messages

      const sellerJid = `${hardcodedSellerNumber}@c.us`;
      const isFromSeller = message.from === sellerJid;

      // 🟢 Case 1: Buyer sending a message
      if (!isFromSeller) {
        if (message.hasMedia) {
          return; // Don’t forward buyer media
        }

        try {
          // Save order to backend
          const response = await axios.post("http://localhost:3000/orders", {
            buyer: message.from,
            text: message.body,
          });

          const { order } = response.data;

          // ✅ Forward text to seller only once
          await client.sendMessage(sellerJid, `\n${message.body}`);
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

    console.log("🤖 Initializing WhatsApp client...");
    await client.initialize();
    console.log("✅ WhatsApp client initialized successfully!");
    return client;
  } catch (err) {
    console.error("🔥 Bot failed to start:", err.message);
    throw err;
  }
}

module.exports = startBot;
