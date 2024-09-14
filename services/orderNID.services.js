const OrderNId = require("../models/OrderNID");
const PriceList = require("../models/PriceList");
const User = require("../models/User");

exports.createNewOrderNIDService = async (data) => {
  try {
    const isExistUser = await User.findOne({ email: data?.email });

    if (!isExistUser) {
      throw new Error("User does not exist");
    }

    const priceList = await PriceList.find();
    if (priceList.length === 0) {
      throw new Error("Price list is empty");
    }

    const price = Number(priceList[0]?.nidOrder);
    const amount = isExistUser?.amount;

    if (amount < 0 || amount < price) {
      throw new Error("Insufficient funds");
    }

    const result = await OrderNId.create(data);

    await User.updateOne(
      { email: data.email },
      { $inc: { amount: -price } },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error creating server copy:", error);
    throw error; // Rethrow the error after logging it
  }
};

exports.getAllOrderNIDService = async () => {
  const result = await OrderNId.find({});
  return result;
};

exports.getAOrderNIDService = async (_id) => {
  const result = await OrderNId.findById({ _id });

  return result;
};
exports.getAOrderNIDDataByEmailService = async (email) => {
  const result = await OrderNId.find({ email });

  return result;
};

exports.updateAOrderNIDService = async ({ _id, data, fileName }) => {
  const updatedData = {
    ...data,
  };

  if (fileName) {
    updatedData.pdf = fileName; // Add the file name to the update if present
  }

  const updatedOrder = await OrderNId.findByIdAndUpdate(
    _id,
    { $set: updatedData },
    { new: true }
  );
  return updatedOrder;
};

exports.deleteAOrderNIDService = async (_id) => {
  const result = await OrderNId.deleteOne({ _id });

  return result;
};
