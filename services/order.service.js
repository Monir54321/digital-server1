const mongoose = require("mongoose");
const Order = require("../models/order.model");

const parseMultipleOrders = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const orders = [];

  const allowedLengths = [8, 9, 10, 12, 13, 17]; // ✅ allowed serial lengths

  for (const line of lines) {
    // Extract orderNumber: find a digit sequence
    const idMatch = line.match(/\d+/);
    const orderNumber = idMatch ? idMatch[0] : null;

    // ✅ Skip if no number or number length not in allowedLengths
    if (!orderNumber || !allowedLengths.includes(orderNumber.length)) {
      continue;
    }

    // Extract name after "Name:" or fallback
    const nameMatch = line.match(/Name[:-]?\s*([^,]+)/i);
    let name = null;

    if (nameMatch) {
      name = nameMatch[1].trim();
    } else {
      name = line.replace(orderNumber, "").trim(); // fallback name
    }

    orders.push({ orderNumber, name });
  }

  if (orders.length === 0) {
    throw new Error("❌ No valid orders found in message");
  }

  return orders;
};

const createOrder = async (
  buyer,
  text,
  forwardedMessageId,
  sellerForwardedId
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ordersData = parseMultipleOrders(text);

    const ordersToCreate = ordersData.map(({ orderNumber, name }) => ({
      buyer,
      orderNumber,
      name,
      status: "Pending",
      forwardedMessageId,
      sellerForwardedId,
    }));

  

    const orders = await Order.create(ordersToCreate, {
      session,
      ordered: true,
    });

    console.log(orders);

    await session.commitTransaction();

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({ orderNumber }).session(session);
    if (!order) {
     
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

    await session.commitTransaction();

    session.endSession();

    return order;
  } catch (err) {
    await session.abortTransaction();
    console.log("🔴 Transaction rolled back due to error:", err.message);
    session.endSession();
    throw err;
  }
};
const findBuyerByReactedMessage = async (reactedMessageBody) => {
 

  if (!reactedMessageBody) {
  
    throw new Error("Reacted message body is required");
  }

  const orderNumberMatch = reactedMessageBody.match(/\d+/);
  console.log("🔢 Extracted order number match:", orderNumberMatch);

  if (!orderNumberMatch) {
   
    throw new Error("No order number found in reacted message body");
  }

  const orderNumber = orderNumberMatch[0];
 

  const order = await Order.findOne({ orderNumber });
  

  if (!order) {
    console.log(`❌ Order not found for number: ${orderNumber}`);
    throw new Error(`Order not found for number: ${orderNumber}`);
  }

  console.log("👤 Returning buyer:", order.buyer);
  return order.buyer;
};

module.exports = {
  createOrder,
  processSellerResponse,
  findBuyerByReactedMessage,
};
