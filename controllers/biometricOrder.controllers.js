const {
  createNewBiometricOrderService,
  getAllBiometricOrderService,
  getABiometricOrderService,
  updateABiometricOrderService,
  deleteABiometricOrderService,
  getABiometricOrderDataByEmailService,
} = require("../services/biometricOrder.services");

exports.createNewBiometricOrderControllers = async (req, res) => {
  try {
    const data = req.body;
    const result = await createNewBiometricOrderService(data);
    res.status(200).send({
      status: "success",
      message: "Successfully created your order",
      data: result,
    });
  } catch (error) {
    res.status(401).send({
      status: "Failed",
      message: "Failed to send your request",
      data: error.message,
    });
  }
};

exports.getAllBiometricOrderControllers = async (req, res) => {
  try {
    const result = await getAllBiometricOrderService();

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

exports.getABiometricOrderControllers = async (req, res) => {
  try {
    const _id = req.params._id;

    const result = await getABiometricOrderService(_id);

    res.status(200).send({
      status: "Success",
      message: "Successfully got your data",
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
exports.getABiometricOrderDataByEmailControllers = async (req, res) => {
  try {
    const email = req.params.email;

    const result = await getABiometricOrderDataByEmailService(email);

    res.status(200).send({
      status: "Success",
      message: "Successfully got your data",
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

exports.updateABiometricOrderControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = req.body;

    const result = await updateABiometricOrderService({ _id, data });

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

exports.deleteABiometricOrderControllers = async (req, res) => {
  try {
    const _id = req.params._id;

    const result = await deleteABiometricOrderService(_id);

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
