const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

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
const hardcodedSellerNumber = "6598749307";

// Handle buyer messages
client.on("message", async (message) => {
  if (message.fromMe) return;

  if (message.hasMedia) {
    console.log("📥 Media message received, skipping buyer logic.");
    return;
  }

  console.log("📥 Buyer message:", message.from, message.body);

  try {
    const response = await axios.post("http://localhost:5000/orders", {
      buyer: message.from,
      text: message.body,
    });

    const { order } = response.data;

    console.log("✅ Order saved in DB:", order);

    const sellerJid = `${hardcodedSellerNumber}@c.us`;

    await client.sendMessage(sellerJid, `\n${message.body}`);

    console.log("📤 Order forwarded to seller:", sellerJid);

    // React to buyer's message with a check mark emoji instead of reply text
  } catch (err) {
    console.error("❌ Error saving order:", err.message);
  }
});

// Handle seller PDF responses
client.on("message", async (message) => {
  if (message.fromMe) return;

  if (message.hasMedia) {
    console.log("📥 Seller sent a media file");

    const media = await message.downloadMedia();

    // Extract order number from the seller's message text
    const orderNumberMatch = message.body?.match(/\d+/);
    const orderNumber = orderNumberMatch ? orderNumberMatch[0] : null;

    if (!orderNumber) {
      console.log("❌ Seller message does not contain a valid order number.");
      await message.react("❌");
      return;
    }

    // Ensure PDFs folder exists
    const pdfFolder = path.join(__dirname, "..", "pdfs");
    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder, { recursive: true });
    }

    // Save the PDF with real order number in filename
    const fileName = `${orderNumber}_${media.filename}`;
    const filePath = path.join(pdfFolder, fileName);

    fs.writeFileSync(filePath, media.data, "base64");
    console.log("📥 PDF saved:", filePath);

    try {
      // Send PDF info to backend
      const response = await axios.post(
        "http://localhost:5000/orders/seller-response",
        {
          orderNumber,
          pdfFileName: fileName,
          seller: message.from,
        }
      );

      const { buyer } = response.data.order;

      if (buyer) {
        // Send PDF and confirmation to buyer

        await client.sendMessage(buyer, media);

        console.log("📤 PDF sent to buyer:", buyer);
      } else {
        console.log("⚠️ No buyer found for order:", orderNumber);
        await message.react("❌");
      }
    } catch (err) {
      console.error("❌ Error processing seller response:", err.message);
      await message.react("❌");
    }
  }
});

// Start the WhatsApp bot
client.initialize();

module.exports = client;
