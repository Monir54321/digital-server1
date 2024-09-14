const SignCopy = require("../models/SignCopy");

// create a SignCopy
exports.createNewSignCopyService = async (data) => {
  const result = await SignCopy.create(data);
  return result;
};

// get all SignCopy
exports.getAllSignCopyService = async () => {
  const result = await SignCopy.find({});
  return result;
};

// get a SignCopy
exports.getASignCopyService = async (_id) => {
  const result = await SignCopy.findOne({ _id });
  return result;
};
exports.getASignCopyDataByEmailService = async (email) => {
  const result = await SignCopy.find({ email });
  return result;
};

// update a SignCopy
exports.updateASignCopyService = async ({ _id, data,fileName }) => {
  const updatedData = {
    ...data,
  };

  if (fileName) {
    updatedData.pdf = fileName; // Add the file name to the update if present
  }

  const updatedOrder = await SignCopy.findByIdAndUpdate(
    _id,
    { $set: updatedData },
    { new: true }
  );
  return updatedOrder;
};

// delete a SignCopy
exports.deleteASignCopyService = async (_id) => {
  const result = await SignCopy.deleteOne({ _id });
  return result;
};
