const { setGlobalIdToken } = require("./globalData");
const { StatusCodes } = require("http-status-codes");
const { response } = require("./response");
const tokenHeaders = require("./tokenHeaders");

const grantToken = async (req, res, next) => {
  console.log("Grant Token API Start !!");
  try {
    const headers = tokenHeaders();
    console.log("Token headers:", headers);

    const requestBody = {
      app_key: process.env.bkash_api_key || "hMTrG0l4tCAVZYAxBihvbiKvtc",
      app_secret:
        process.env.bkash_secret_key ||
        "iEXYSI99xwn9SA2LFiEnQed5nUukuwscFqoTcJH8GCIsnA5LtOJx",
    };
    console.log("Request body:", requestBody);

    const grantTokenUrl =
      process.env.bkash_grant_token_url ||
      "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant";

    const tokenResponse = await fetch(grantTokenUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    console.log("Token response status:", tokenResponse.status);

    const tokenResult = await tokenResponse.json();
    console.log("Token result:", tokenResult);

    if (!tokenResult?.id_token) {
      console.error("No id_token received:", tokenResult);
      return response(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        {},
        "Failed to obtain access token"
      );
    }

    setGlobalIdToken(tokenResult?.id_token);
    console.log("Token set successfully");

    next();
  } catch (e) {
    console.error("Grant token error:", e);
    return response(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      {},
      "You are not allowed"
    );
  }
};

module.exports = grantToken;
