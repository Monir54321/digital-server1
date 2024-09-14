const globals = require('node-global-storage'); // Ensure this is imported
require('dotenv').config(); // Load environment variables if you're using dotenv

const bkash_headers = async () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    authorization: globals.getValue("id_token"),
    "x-app-key": process.env.bkash_api_key,
  };
};

module.exports = bkash_headers;
