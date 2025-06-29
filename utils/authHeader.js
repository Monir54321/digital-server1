const { getGlobalIdToken } = require("./globalData");

const authHeaders = async () => {
  let info = await getGlobalIdToken();
  console.log("🚀 ~ file: authHeader.js:6 ~ authHeaders ~ info:", info);

  if (!info) {
    throw new Error(
      "No access token available. Please ensure grantToken middleware is called first."
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    authorization: info,
    "x-app-key": process.env.bkash_api_key || "hMTrG0l4tCAVZYAxBihvbiKvtc",
  };

  console.log("Auth headers:", headers);
  return headers;
};

module.exports = authHeaders;
