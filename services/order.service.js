const mongoose = require("mongoose");
const Order = require("../models/order.model");

const parseMultipleOrders = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const orders = [];

  for (const line of lines) {
    const hasNumber = /\d/.test(line);
    const hasLetter = /[a-zA-Z]/.test(line);

    // Save if line has number (only numbers or numbers+letters)
    if (!hasNumber) {
      console.log("⚠️ Skipping line without numbers:", line);
      continue; // skip lines with no numbers at all
    }

    // Extract orderNumber: longest digit sequence (6+ digits)
    const idMatch = line.match(/\d{6,}/);
    const orderNumber = idMatch ? idMatch[0] : null;

    // Extract name after "Name:" or fallback
    const nameMatch = line.match(/Name[:-]?\s*([^,]+)/i);
    let name = null;

    if (nameMatch) {
      name = nameMatch[1].trim();
    } else {
      // fallback: line without orderNumber (if any)
      name = orderNumber ? line.replace(orderNumber, "").trim() : line;
    }

    orders.push({ orderNumber, name });
  }

  if (orders.length === 0) {
    throw new Error("No valid orders found in message");
  }

  return orders;
};


const createOrder = async (buyer, text) => {
  console.log("📥 [Service] Received buyer message:", { buyer, text });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ordersData = parseMultipleOrders(text);

    const ordersToCreate = ordersData.map(({ orderNumber, name }) => ({
      buyer,
      orderNumber,
      name,
      status: "Pending",
    }));

    const orders = await Order.create(ordersToCreate, {
      session,
      ordered: true,
    });

    console.log(`✅ ${orders.length} orders saved in DB`);
    orders.forEach((order) =>
      console.log("🔎 Saved order:", {
        orderNumber: order.orderNumber,
        name: order.name,
      })
    );

    await session.commitTransaction();
    console.log("🟢 Transaction committed");
    session.endSession();

    return orders;
  } catch (err) {
    await session.abortTransaction();
    console.log("🔴 Transaction rolled back due to error:", err.message);
    session.endSession();
    throw err;
  }
};

const processSellerResponse = async (orderNumber, pdfFileName, status) => {
  console.log("📥 [Service] Seller response received:", {
    orderNumber,
    pdfFileName,
    status,
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({ orderNumber }).session(session);
    if (!order) {
      console.log("❌ No order found for number:", orderNumber);
      throw new Error("Order not found");
    }

    if (status) {
      order.status = status;
    } else if (pdfFileName.includes(orderNumber)) {
      order.status = "Confirmed";
    } else {
      throw new Error("PDF filename does not match order number");
    }

    order.pdfFileName = pdfFileName;

    await order.save({ session });
    console.log(`✅ Order updated as ${order.status}`);

    await session.commitTransaction();
    console.log("🟢 Transaction committed");
    session.endSession();

    return order;
  } catch (err) {
    await session.abortTransaction();
    console.log("🔴 Transaction rolled back due to error:", err.message);
    session.endSession();
    throw err;
  }
};

module.exports = {
  createOrder,
  processSellerResponse,
};
