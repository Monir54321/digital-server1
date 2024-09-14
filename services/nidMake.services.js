const PriceList = require("../models/PriceList");
const User = require("../models/User");

exports.createNewNidMakeService = async (data) => {
  try {
    const isExistUser = await User.findOne({ email: data?.email });

    if (!isExistUser) {
      throw new Error("User does not exist");
    }

    const priceList = await PriceList.find();
    if (priceList.length === 0) {
      throw new Error("Price list is empty");
    }

    const price = Number(priceList[0]?.nidMake);
    const amount = isExistUser?.amount;

    if (amount < price) {
      throw new Error("Insufficient funds");
    }

    await User.updateOne(
      { email: data.email },
      { $inc: { amount: -price } },
      { new: true }
    );

    return "successfully ordered nid make";
  } catch (error) {
    console.error("Error creating server copy:", error);
    throw error; // Rethrow the error after logging it
  }
};

exports.getANidMakeService = async (id) => {
  const result = await NidMake.findOne({ _id: id });

  return result;
};

exports.getAllNidMakeService = async () => {
  const result = await NidMake.find({});

  return result;
};

exports.getANidMakeDataByEmailService = async (email) => {
  const result = await NidMake.find({ email });

  return result;
};

exports.updateANidMakeService = async ({ _id, data }) => {
  const result = await NidMake.updateOne(
    { _id },
    { $set: { ...data } },
    { upsert: true }
  );

  return result;
};

exports.deleteANidMakeService = async (_id) => {
  const result = await NidMake.deleteOne({ _id });

  return result;
};
