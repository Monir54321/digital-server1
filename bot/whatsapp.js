const { Client, RemoteAuth } = require("whatsapp-web.js");
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");

const hardcodedSellerNumber = "8801884562356";

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
    console.log("✅ MongoStore is ready!");

    // 🔄 Create WhatsApp Client
    console.log("🔄 Initializing WhatsApp client...");
const client = new Client({
  authStrategy: new RemoteAuth({
    store,
    backupSyncIntervalMs: 300000, // 5 minutes
  }),
  puppeteer: {
    headless: false, // false to debug
    executablePath: require("puppeteer").executablePath(),
    ignoreDefaultArgs: ["--disable-extensions"], // ✅ allow custom args
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
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
      console.log("📥 Received message:", {
        from: message.from,
        body: message.body,
        hasMedia: message.hasMedia,
      });

      if (message.fromMe) {
        console.log("📤 Ignoring message from myself.");
        return;
      }

      try {
        if (message.hasMedia) {
          console.log("📥 Media message detected. Processing...");
          const media = await message.downloadMedia();

          console.log("✅ Media downloaded.");

          // Extract order number from seller message
          const orderNumberMatch = message.body?.match(/\d+/);
          const orderNumber = orderNumberMatch ? orderNumberMatch[0] : null;

          console.log("🔍 Extracted order number:", orderNumber);

          if (!orderNumber) {
            console.error(
              "❌ No valid order number found in seller's message."
            );
            await message.react("❌");
            return;
          }

          // Save PDF locally
          const pdfFolder = path.join(__dirname, "pdfs");
          if (!fs.existsSync(pdfFolder)) {
            fs.mkdirSync(pdfFolder, { recursive: true });
            console.log("📂 Created PDFs folder:", pdfFolder);
          }

          const fileName = `${orderNumber}_${media.filename}`;
          const filePath = path.join(pdfFolder, fileName);

          fs.writeFileSync(filePath, media.data, "base64");
          console.log("✅ PDF saved at:", filePath);

          // Send PDF to backend
          console.log("📡 Sending PDF info to backend...");
          const response = await axios.post(
            "https://digital-server1.onrender.com/orders/seller-response",
            {
              orderNumber,
              pdfFileName: fileName,
              seller: message.from,
            }
          );

          console.log("✅ Backend response received:", response.data);

          const { buyer } = response.data.order;

          if (buyer) {
            console.log("📤 Sending PDF to buyer:", buyer);
            await client.sendMessage(buyer, media);
            console.log("✅ PDF sent to buyer.");
          } else {
            console.warn("⚠️ No buyer found for order number:", orderNumber);
            await message.react("❌");
          }
        } else {
          console.log("💬 Text message detected. Processing buyer logic...");

          // Send buyer message to backend
          const response = await axios.post(
            "https://digital-server1.onrender.com/orders",
            {
              buyer: message.from,
              text: message.body,
            }
          );

          console.log("✅ Order saved in DB:", response.data.order);

          const sellerJid = `${hardcodedSellerNumber}@c.us`;
          console.log("📤 Forwarding message to seller:", sellerJid);

          await client.sendMessage(sellerJid, `\n${message.body}`);
          console.log("✅ Message forwarded to seller.");
        }
      } catch (err) {
        console.error("❌ Error processing message:", err.message);
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
