const {
  createNewNidMakeService,
  deleteANidMakeService,
  getANidMakeDataByEmailService,
  getANidMakeService,
  getAllNidMakeService,
  updateANidMakeService,
} = require("../services/nidMake.services");

exports.createNewNidMakeControllers = async (req, res) => {
  try {
    const data = req.body;
    console.log("controller nid make body", data);
    const result = await createNewNidMakeService(data);
    res.status(200).send({
      status: "Success",
      message: "Successfully ordered your NID",
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

exports.getAllNidMakeControllers = async (req, res) => {
  try {
    const result = await getAllNidMakeService();

    res.status(200).send({
      status: "Success",
      message: "Successfully get all NID data",
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

exports.getANidMakeControllers = async (req, res) => {
  try {
    const _id = req.params._id;

    const result = await getANidMakeService(_id);

    res.status(200).send({
      status: "Success",
      message: "Successfully got your NID data",
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
exports.getANidMakeDataByEmailControllers = async (req, res) => {
  try {
    const email = req.params.email;

    const result = await getANidMakeDataByEmailService(email);

    res.status(200).send({
      status: "Success",
      message: "Successfully got your NID data",
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

exports.updateANidMakeControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = req.body;

    const result = await updateANidMakeService({ _id, data });

    res.status(200).send({
      status: "Success",
      message: "Successfully updated NID data",
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

exports.deleteANidMakeControllers = async (req, res) => {
  try {
    const _id = req.params._id;

    const result = await deleteANidMakeService(_id);

    res.status(200).send({
      status: "Success",
      message: "Successfully deleted NID data",
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
