// utils/orderParser.js
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

    if (!orderNumber || !allowedLengths.includes(orderNumber.length)) {
      continue;
    }

    const nameMatch = line.match(/Name[:-]?\s*([^,]+)/i);
    let name = null;

    if (nameMatch) {
      name = nameMatch[1].trim();
    } else {
      name = line.replace(orderNumber, "").trim();
    }

    orders.push({ orderNumber, name });
  }

  return orders;
};

export const validateOrder = { parseMultipleOrders, allowedLengths };
