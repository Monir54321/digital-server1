const {
  createNewSignCopyService,
  getAllSignCopyService,
  getASignCopyService,
  getASignCopyDataByEmailService,
  updateASignCopyService,
  deleteASignCopyService,
} = require("../services/signCopy.services");

exports.createNewSignCopyControllers = async (req, res) => {
  try {
    const data = req.body;
    const result = await createNewSignCopyService(data);

    if (!result) {
      return res.status(500).send({
        status: "Failed",
        message: "Failed to create the sign copy",
      });
    }

    const amountRes = await fetch(
      `${process.env.backendUrl}/priceList/668f76383906559fe7ff631c`
    );
    const amountData = await amountRes.json();
    const amount = amountData?.data?.signCopy;

    if (!amount) {
      return res.status(500).send({
        status: "Failed",
        message: "Failed to retrieve the amount for sign copy",
      });
    }

    const bRes = await fetch(`${process.env.backendUrl}/users/bikash`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: result?.email, amount, order: true }),
    });

    const bData = await bRes.json();

    if (bData.status !== "Success") {
      return res.status(500).send({
        status: "Failed",
        message: "Failed to update user balance",
      });
    }

    return res.status(200).send({
      status: "Success",
      message: "Successfully submitted",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      message: "Failed to send your request",
      data: error.message,
    });
  }
};

exports.getAllSignCopyControllers = async (req, res) => {
  try {
    const result = await getAllSignCopyService();

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
exports.getASignCopyDataByEmailControllers = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await getASignCopyDataByEmailService(email);

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

exports.updateASignCopyControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = req.body; // Get the status from the request body
    const fileName = req.file ? req.file.filename : null;
    const result = await updateASignCopyService({
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

exports.deleteASignCopyControllers = async (req, res) => {
  try {
    const _id = req.params._id;

    const result = await deleteASignCopyService(_id);

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
