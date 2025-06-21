const axios = require("axios");
const globals = require("node-global-storage");

const bkashAuth = async (req, res, next) => {
  globals.unsetValue("id_token");
  globals.unsetValue("email");

  try {
    const { data } = await axios.post(
      process.env.bkash_grant_token_url,
      {
        app_key: process.env.bkash_api_key,
        app_secret: process.env.bkash_secret_key,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: "01942588940",
          password: "5f5<tjBEagb",
        },
      }
    );

    // globals.set("id_token", data.id_token, { protected: true });
    globals.setValue("id_token", data?.id_token, { protected: true });
    next();
  } catch (error) {
    console.log("middleware error: ", error.message);

    return res.status(401).json({ error: error.message });
  }
};

module.exports = bkashAuth;
