const axios = require("axios");
const globals = require("node-global-storage");

const bkashAuth = async (req, res, next) => {
  globals.unsetValue("id_token");
  globals.unsetValue("email");

  try {
    const grantTokenUrl =
      process.env.bkash_grant_token_url ||
      "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant";

    const { data } = await axios.post(
      grantTokenUrl,
      {
        app_key: process.env.bkash_api_key || "hMTrG0l4tCAVZYAxBihvbiKvtc",
        app_secret:
          process.env.bkash_secret_key ||
          "iEXYSI99xwn9SA2LFiEnQed5nUukuwscFqoTcJH8GCIsnA5LtOJx",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: process.env.bkash_username || "01942588940",
          password: process.env.bkash_password || "5f5<tjBEagb",
        },
      }
    );

    console.log("Middleware token response:", data);
    globals.setValue("id_token", data?.id_token, { protected: true });
    next();
  } catch (error) {
    console.log("middleware error: ", error.message);
    console.log("Error details:", error.response?.data);

    return res.status(401).json({ error: error.message });
  }
};

module.exports = bkashAuth;
