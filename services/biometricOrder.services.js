const BiometricOrder = require("../models/BiometricOrder");
const User = require("../models/User");

// create
exports.createNewBiometricOrderService = async (data) => {
  const amount = data.amount;
  delete data.amount;
  try {
    const isExistUser = await User.findOne({ email: data?.email });

    if (!isExistUser) {
      throw new Error("User does not exist");
    }

    if (isExistUser?.amount < 0 || isExistUser?.amount < amount) {
      throw new Error("Insufficient funds");
    }

    const result = await BiometricOrder.create(data);

    await User.updateOne(
      { email: data.email },
      { $inc: { amount: -amount } },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error creating server copy:", error);
  }
};

// get all
exports.getAllBiometricOrderService = async () => {
  const result = await BiometricOrder.find({});
  return result;
};

// get a
exports.getABiometricOrderService = async (_id) => {
  const result = await BiometricOrder.findOne({ _id });
  return result;
};
exports.getABiometricOrderDataByEmailService = async (email) => {
  const result = await BiometricOrder.find({ email });
  return result;
};

// update a
exports.updateABiometricOrderService = async ({ _id, data }) => {
  const result = await BiometricOrder.updateOne(
    { _id },
    { $set: { ...data } },
    { upsert: true }
  );
  return result;
};

// delete a
exports.deleteABiometricOrderService = async (_id) => {
  const result = await BiometricOrder.deleteOne({ _id });
  return result;
};
