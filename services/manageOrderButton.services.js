const ManageOrderButton = require("../models/manageOrderButton");

const create = async (data) => {
  const result = await ManageOrderButton.create(data);

  return result;
};

const getAll = async () => {
  const result = await ManageOrderButton.find({});

  return result;
};

// exports.getAUserBikashInfoOrderService = async (_id) => {

//     const result = await BikashInfoOrder.findOne({_id});

//     return result;
// }
// exports.getAUserBikashInfoOrdersDataByEmailService = async (email) => {

//     const result = await BikashInfoOrder.find({email});

//     return result;
// }

const updateOne = async ({ _id, data }) => {
  // Check if the document exists
  const isExist = await ManageOrderButton.findById(_id);

  if (!isExist) {
    throw new Error("Document with the provided ID does not exist.");
  }

  console.log("data", data);
  // Update the document
  const result = await ManageOrderButton.updateOne(
    { _id },
    { $set: { ...data } },
    { upsert: true } // This option creates a new document if none exists with the given _id
  );

  return result;
};

// exports.deleteAUserBikashInfoOrderService = async (_id) => {

//     const result = await BikashInfoOrder.deleteOne({_id});

//     return result;
// }

module.exports = {
  create,
  getAll,
  updateOne,
};
