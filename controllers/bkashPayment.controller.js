const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");
let mainEmail;

const authHeaders = require("../utils/authHeader");
const { uuid } = require("uuidv4");

const createPayment = async (req, res, next) => {
  try {
    const { amount, email } = req.body;

    mainEmail = email;

    const createPaymentUrl =
      process.env.bkash_create_payment_url ||
      "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create";
    const callbackUrl = process.env.backendUrl + "/api/bkash/callback";

    const result = await fetch(createPaymentUrl, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({
        mode: "0011",
        payerReference: " ",
        callbackURL: callbackUrl,
        amount: amount ? amount : "1",
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + uuid(),
        email: email,
      }),
    });

    const data = await result.json();
    console.log("Create payment response:", data);

    return response(res, StatusCodes.CREATED, true, { data }, "");
  } catch (error) {
    console.log(
      "🚀 ~ file: bkashPayment.controller.js:28 ~ createPayment ~ error:",
      error
    );
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const bkashCallback = async (req, res) => {
  try {
    if (req.query.status === "success") {
      console.log("Execute Payment API Start !!!");

      const { paymentID } = req.query;

      const executePaymentUrl =
        process.env.bkash_execute_payment_url ||
        "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/execute";

      const executeResponse = await fetch(executePaymentUrl, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({
          paymentID,
        }),
      });
      const result = await executeResponse.json();

      const payed = result?.amount;
      console.log("result?.email ", result?.data?.email);

      console.log(
        "🚀 ~ file: bkashPayment.controller.js:58 ~ bkashCallback ~ result:",
        result
      );

      if (result.statusCode && result.statusCode === "0000") {
        // 1. add money on user account
        const addMoneyRes = await fetch(
          `${process.env.backendUrl}/users/bikash`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: mainEmail, amount: payed }),
          }
        );
        const addMoneyData = await addMoneyRes.json();

        if (addMoneyData) {
          //
        } else {
          const addMoneyRes = await fetch(
            `${process.env.backendUrl}/users/bikash`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: mainEmail, amount: payed }),
            }
          );
          const addMoneyData = await addMoneyRes.json();
        }

        console.log("Payment Successful !!! ");
        // save response in your db

        // Your frontend success route
        const successUrl = process.env.frontendUrl + "/payment-success";
        return res.redirect(`${successUrl}?data=${result.statusMessage}`);
      } else {
        console.log("Payment Failed !!!");

        const failUrl = process.env.frontendUrl + "/payment-fail";
        return res.redirect(failUrl);
      }
    }
  } catch (e) {
    console.log("Payment Failed !!!");

    const failUrl = process.env.frontendUrl + "/payment-fail";
    return res.redirect(failUrl);
  }
};

module.exports = { createPayment, bkashCallback };
