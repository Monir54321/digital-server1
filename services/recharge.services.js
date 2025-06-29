const { default: axios } = require("axios");
const Recharge = require("../models/Recharge");
const globals = require("node-global-storage");
const { v4: uuidv4 } = require("uuid");
const bkash_headers = require("../utils/bkashHeaders");

exports.createNewRechargeService = async (payload) => {
  try {
    const createPaymentUrl =
      process.env.bkash_create_payment_url ||
      "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create";

    const { data } = await axios.post(
      createPaymentUrl,
      {
        mode: "0011", //it means it works checkout(url based)
        payerReference: " ",
        callbackURL: `${process.env.backendUrl}/bkash/payment/callback`,
        amount: `${payload.amount}`,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
      },
      {
        headers: await bkash_headers(),
      }
    );
    console.log("payment created", data); // show the response when the payment is created
    return data?.bkashURL;
  } catch (error) {
    console.log("bkash payment error", error);
    throw new Error(error?.message);
  }
};

// get all
exports.getAllRechargeService = async () => {
  const result = await Recharge.find({});
  return result;
};

// get a
exports.getARechargeService = async (_id) => {
  const result = await Recharge.findOne({ _id });
  return result;
};

// update a
exports.updateARechargeService = async ({ _id, data }) => {
  const result = await Recharge.updateOne(
    { _id },
    { $set: { ...data } },
    { upsert: true }
  );
  return result;
};

// delete a
exports.deleteARechargeService = async (_id) => {
  const result = await Recharge.deleteOne({ _id });
  return result;
};
