const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const allowedLengths = [8, 9, 10, 12, 13, 17];

const parseMultipleOrders = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const orders = [];

  for (const line of lines) {
    const idMatch = line.match(/\d+/);
    const orderNumber = idMatch ? idMatch[0] : null;

    if (!orderNumber || !allowedLengths.includes(orderNumber.length)) continue;

    const nameMatch = line.match(/Name[:-]?\s*([^,]+)/i);
    let name = nameMatch
      ? nameMatch[1].trim()
      : line.replace(orderNumber, "").trim();

    orders.push({ orderNumber, name });
  }

  return orders;
};

async function getSellerNumber() {
  try {
    const res = await axios.get(
      "http://localhost:3000/orders/get-seller-number"
    );
    return res.data?.seller?.whatsappNumber || null;
  } catch (err) {
    console.error("❌ Failed to fetch seller number:", err.message);
    return null;
  }
}

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

// Send WhatsApp notification when called from backend
async function sendOrderNotification(orderNumber, customerName, details) {
  const sellerNumber = await getSellerNumber();
  if (!sellerNumber) throw new Error("No seller number available");
  const sellerJid = `${sellerNumber}@c.us`;
  let message = `🛒 New Order Received!\nOrder Number: ${orderNumber}\nCustomer: ${customerName}`;
  if (details) message += `\nDetails: ${details}`;
  await client.sendMessage(sellerJid, message);
}

const messageMap = {};

const markSeen = async (message) => {
  try {
    const chat = await message.getChat();
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

client.on("qr", (qr) => {
  console.log("📲 Scan this QR code to log in:");
  require("qrcode-terminal").generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp Bot is ready!");
});

client.on("message", async (message) => {
  if (message.fromMe) return;

  // Fetch seller number every time
  const sellerNumber = await getSellerNumber();
  if (!sellerNumber) {
    console.log("❌ No seller number available. Ignoring message.");
    return;
  }

  const sellerJid = `${sellerNumber}@c.us`;
  const isFromSeller = message.from === sellerJid;

  markSeen(message);

  // CASE 1: Buyer sends a message
  if (!isFromSeller) {
    if (message.hasMedia) return;

    const parsedOrders = parseMultipleOrders(message.body);
    if (parsedOrders.length === 0) {
      console.log("❌ Ignored: No valid order numbers found in message");
      return;
    }

    try {
      const chat = await message.getChat();
      const forwardedMsg = await client.sendMessage(
        sellerJid,
        `\n${message.body}`
      );

      await axios.post("http://localhost:3000/orders", {
        buyer: message.from,
        text: message.body,
        forwardedMessageId: message.id._serialized,
        sellerForwardedId: forwardedMsg.id._serialized,
      });

      await chat.sendSeen();
    } catch (err) {
      console.error("❌ Error forwarding order:", err.message);
    }
  }

  // CASE 2: Seller sends PDF/media
  else {
    if (!message.hasMedia) return;

    const media = await message.downloadMedia();
    await client.sendSeen(message.from);

    const orderNumberMatch = message.body?.match(/\d+/);
    const orderNumber = orderNumberMatch ? orderNumberMatch[0] : null;
    if (!orderNumber) return;

    const pdfFolder = path.join(__dirname, "..", "pdfs");
    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder, { recursive: true });
    }

    const fileName = `${orderNumber}_${media.filename}`;
    fs.writeFileSync(path.join(pdfFolder, fileName), media.data, "base64");

    try {
      const response = await axios.post(
        "http://localhost:3000/orders/seller-response",
        {
          orderNumber,
          pdfFileName: fileName,
          seller: message.from,
        }
      );

      const { buyer } = response.data.order;
      if (buyer) await client.sendMessage(buyer, media);
    } catch (err) {
      console.error("❌ Error processing seller response:", err.message);
    }
  }
});

client.on("message_reaction", async (reaction) => {
  const sellerNumber = await getSellerNumber();
  if (!sellerNumber) return;

  const sellerJid = `${sellerNumber}@c.us`;
  const sender = reaction.id.participant || reaction.id.remote;
  if (sender !== sellerJid) return;

  try {
    const originalMsg = await client.getMessageById(reaction.msgId._serialized);
    let buyerMsgId = messageMap[originalMsg.id._serialized];
    let buyer;

    if (!buyerMsgId) {
      const res = await axios.post("http://localhost:3000/orders/find-buyer", {
        forwardedMessageId: originalMsg.id._serialized,
      });
      buyer = res.data?.buyer;
      buyerMsgId = res.data?.buyerMsgId;
      if (!buyer || !buyerMsgId) return;
    }

    const buyerMsg = await client.getMessageById(buyerMsgId);
    if (!buyerMsg) return;

    const emoji =
      typeof reaction.reaction === "string"
        ? reaction.reaction
        : reaction.reaction?.toString?.() || "";
    if (!emoji) return;

    await buyerMsg.react(emoji);
  } catch (err) {
    console.error("❌ Error forwarding reaction:", err.message);
  }
});

// Start the WhatsApp bot
client.initialize();

module.exports = client;
module.exports.sendOrderNotification = sendOrderNotification;
