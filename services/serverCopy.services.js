const PriceList = require("../models/PriceList");
const ServerCopy = require("../models/ServerCopy");
const User = require("../models/User");

// create a ServerCopy
exports.createNewServerCopyService = async (data) => {
  try {
    const isExistUser = await User.findOne({ email: data?.email });

    if (!isExistUser) {
      throw new Error("User does not exist");
    }

    const priceList = await PriceList.find();
    if (priceList.length === 0) {
      throw new Error("Price list is empty");
    }

    const price = Number(priceList[0]?.serverCopy);
    const amount = isExistUser?.amount;

    if (amount < 0 || amount < price) {
      throw new Error("Insufficient funds");
    }

    await User.updateOne(
      { email: data.email },
      { $inc: { amount: -price } },
      { new: true }
    );

    return "successfully create server copy";
  } catch (error) {
    console.error("Error creating server copy:", error);
    throw error; // Rethrow the error after logging it
  }
};

// get all ServerCopy
exports.getAllServerCopyService = async () => {
  const result = await ServerCopy.find({});
  return result;
};

// get a ServerCopy
exports.getAServerCopyService = async (_id) => {
  const result = await ServerCopy.findOne({ _id });
  return result;
};
exports.getAServerCopyDataByEmailService = async (email) => {
  const result = await ServerCopy.find({ email });
  return result;
};

// update a ServerCopy
exports.updateAServerCopyService = async ({ _id, data }) => {
  console.log("_id and data", _id, data);
  const result = await ServerCopy.updateOne(
    { _id },
    { $set: { ...data } },
    { upsert: true }
  );
  return result;
};

// delete a ServerCopy
exports.deleteAServerCopyService = async (_id) => {
  const result = await ServerCopy.deleteOne({ _id });
  return result;
};
