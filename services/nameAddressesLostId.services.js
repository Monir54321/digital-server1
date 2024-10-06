const NameAddressesLostId = require("../models/NameAddressesLostId");
const PriceList = require("../models/PriceList");
const User = require("../models/User");

// create a SignCopy
// exports.createNameAddressesLostIdService = async (data) => {
//   try {
//     const isExistUser = await User.findOne({ email: data?.email });

//     if (!isExistUser) {
//       throw new Error("User does not exist");
//     }

//     const priceList = await PriceList.find();
//     if (priceList.length === 0) {
//       throw new Error("Price list is empty");
//     }

//     const price = Number(priceList[0]?.nameAddressesLostId);
//     const amount = isExistUser?.amount;

//     if (amount < price) {
//       throw new Error("Insufficient funds");
//     }

//     await NameAddressesLostId.create({
//       title: data?.title,
//       email: data.email,
//       description: data.name,
//     })

//     await User.updateOne(
//       { email: data.email },
//       { $inc: { amount: -price } },
//       { new: true }
//     );

//     return "successfully ordered nameAddressesLostId";
//   } catch (error) {
//     console.error("Error creating server copy:", error);
//     throw error; // Rethrow the error after logging it
//   }
// };

exports.createNameAddressesLostIdService = async (data) => {
  try {
    // Validate input data
    if (!data?.email || !data?.title || !data?.name) {
      throw new Error("Missing required fields");
    }

    const isExistUser = await User.findOne({ email: data.email });
    if (!isExistUser) {
      throw new Error("User does not exist");
    }

    const priceList = await PriceList.find();
    if (priceList.length === 0) {
      throw new Error("Price list is empty");
    }

    const price = Number(priceList[0]?.nameAddressesLostId);
    if (isNaN(price)) {
      throw new Error("Price is not valid");
    }

    const amount = isExistUser.amount;
    if (amount < price) {
      throw new Error("Insufficient funds");
    }

    // Create NameAddressesLostId
    await NameAddressesLostId.create({
      title: data.title,
      email: data.email,
      description: data.name,
    });

    // Update User's amount
    await User.updateOne(
      { email: data.email },
      { $inc: { amount: -price } }
    );

    return "Successfully ordered NameAddressesLostId";
  } catch (error) {
    console.error("Error creating NameAddressesLostId:", error);
    throw error; // Rethrow the error after logging it
  }
};

// get all SignCopy
exports.getAllNameAddressLostService = async () => {
  const result = await NameAddressesLostId.find({});
  return result;
};

// get a SignCopy
exports.getASignCopyService = async (_id) => {
  const result = await SignCopy.findOne({ _id });
  return result;
};
exports.getNameAddressLossDataByEmailService = async (email) => {
  const result = await NameAddressesLostId.find({ email });
  return result;
};

// update a SignCopy
exports.updateNameAddressLossService = async ({ _id, data, fileName }) => {
  console.log("id, data, fileName", _id, data, fileName);
  const updatedData = {
    ...data,
  };

  if (fileName) {
    updatedData.pdf = fileName; // Add the file name to the update if present
  }

  const updatedOrder = await NameAddressesLostId.findByIdAndUpdate(
    _id,
    { $set: updatedData },
    { new: true }
  );
  return updatedOrder;
};

// delete a SignCopy
exports.deleteById = async (_id) => {
  const result = await NameAddressesLostId.deleteOne({ _id });
  return result;
};
