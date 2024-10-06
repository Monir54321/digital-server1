const {
  createNameAddressesLostIdService,
  getAllNameAddressLostService,
  getASignCopyService,
  getNameAddressLossDataByEmailService,
  updateNameAddressLossService,
  deleteById
} = require("../services/nameAddressesLostId.services");

exports.createNameAddressesLostIdControllers = async (req, res) => {
  const data = req.body;
  const result = await createNameAddressesLostIdService(data);
  return res.status(200).send({
    status: "Success",
    message: result,
    data: result,
  });
};

exports.getAllNameAddressLostControllers = async (req, res) => {
  try {
    const result = await getAllNameAddressLostService();

    res.status(200).send({
      status: "Success",
      message: "Successfully get all data",
      data: result,
    });
  } catch (error) {
    res.status(401).send({
      status: "Failed",
      message: "Failed to get data",
      data: error.message,
    });
  }
};

exports.getASignCopyControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const result = await getASignCopyService(_id);

    res.status(200).send({
      status: "Success",
      message: "Successfully got data",
      data: result,
    });
  } catch (error) {
    res.status(401).send({
      status: "Failed",
      message: "Failed to got data",
      data: error.message,
    });
  }
};
exports.getNameAddressLossDataByEmailControllers = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await getNameAddressLossDataByEmailService(email);

    res.status(200).send({
      status: "Success",
      message: "Successfully got data",
      data: result,
    });
  } catch (error) {
    res.status(401).send({
      status: "Failed",
      message: "Failed to got data",
      data: error.message,
    });
  }
};

exports.updateNameAddressLossControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = req.body; // Get the status from the request body
    const fileName = req.file ? req.file.filename : null;

    console.log("controller inside update", _id, fileName, data);
    const result = await updateNameAddressLossService({
      _id,
      data,
      fileName: fileName,
    });

    res.status(200).send({
      status: "Success",
      message: "Successfully updated data",
      data: result,
    });
  } catch (error) {
    res.status(401).send({
      status: "Failed",
      message: "Failed to update data",
      data: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const _id = req.params._id;

    const result = await deleteById(_id);

    res.status(200).send({
      status: "Success",
      message: "Successfully deleted data",
      data: result,
    });
  } catch (error) {
    res.status(401).send({
      status: "Failed",
      message: "Failed to delete data",
      data: error.message,
    });
  }
};
