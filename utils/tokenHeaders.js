const tokenHeaders = () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    username: process.env.bkash_username || "01942588940",
    password: process.env.bkash_password || "5f5<tjBEagb",
  };
};

module.exports = tokenHeaders;
