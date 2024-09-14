const {
  createNewBikashInfoOrderService,
  getAllBikashInfoOrderService,
  getAUserBikashInfoOrderService,
  updateAUserBikashInfoOrderService,
  deleteAUserBikashInfoOrderService,
  getAUserBikashInfoOrdersDataByEmailService,
} = require("../services/bikashInfoOrder.services");

exports.createNewBikashInfoOrderControllers = async (req, res) => {
  try {
    const email = req.body.email;

    const amountRes = await fetch(
      `${process.env.backendUrl}/priceList/668f76383906559fe7ff631c`
    );
    const amountData = await amountRes.json();
    const amount = amountData?.data?.bikashInfo;

    if (!amount) {
      return res.status(400).send({
        status: "Failed",
        message: "Could not retrieve the order amount",
      });
    }

    const bRes = await fetch(`${process.env.backendUrl}/users/bikash`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, amount, order: true }),
    });

    const bData = await bRes.json();

    if (bData.status !== "Success") {
      return res.status(401).send({
        status: "Failed",
        message: "Insufficient balance or failed to process payment",
      });
    }

    const result = await createNewBikashInfoOrderService(req.body);

    if (result) {
      return res.status(200).send({
        status: "Success",
        message: "Successfully submitted",
        data: result,
      });
    } else {
      await fetch(`${process.env.backendUrl}/users/bikash`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, amount: -amount }),
      });

      return res.status(500).send({
        status: "Failed",
        message: "Order creation failed, amount refunded",
      });
    }
  } catch (error) {
    console.error("Error in createNewBikashInfoOrderControllers:", error);

    return res.status(500).send({
      status: "Failed",
      message: "Failed to send your request",
      data: error.message,
    });
  }
};

exports.getAllBikashInfoOrderControllers = async (req, res) => {
  try {
    const result = await getAllBikashInfoOrderService();

    res.status(200).send({
      status: "Success",
      message: "Successfully retrieved all data",
      data: result,
    });
  } catch (error) {
    console.error("Error in getAllBikashInfoOrderControllers:", error);

    res.status(500).send({
      status: "Failed",
      message: "Failed to retrieve data",
      data: error.message,
    });
  }
};

exports.getAUserBikashInfoOrderControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const result = await getAUserBikashInfoOrderService(_id);

    if (!result) {
      return res.status(404).send({
        status: "Failed",
        message: "Data not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Successfully retrieved data",
      data: result,
    });
  } catch (error) {
    console.error("Error in getAUserBikashInfoOrderControllers:", error);

    res.status(500).send({
      status: "Failed",
      message: "Failed to retrieve data",
      data: error.message,
    });
  }
};

exports.getAUserBikashInfoOrdersDataByEmailControllers = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await getAUserBikashInfoOrdersDataByEmailService(email);

    if (!result) {
      return res.status(404).send({
        status: "Failed",
        message: "Data not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Successfully retrieved data",
      data: result,
    });
  } catch (error) {
    console.error(
      "Error in getAUserBikashInfoOrdersDataByEmailControllers:",
      error
    );

    res.status(500).send({
      status: "Failed",
      message: "Failed to retrieve data",
      data: error.message,
    });
  }
};

exports.updateAUserBikashInfoOrderControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = req.body;
    const result = await updateAUserBikashInfoOrderService({ _id, data });

    if (!result) {
      return res.status(404).send({
        status: "Failed",
        message: "Data not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Successfully updated data",
      data: result,
    });
  } catch (error) {
    console.error("Error in updateAUserBikashInfoOrderControllers:", error);

    res.status(500).send({
      status: "Failed",
      message: "Failed to update data",
      data: error.message,
    });
  }
};

exports.deleteAUserBikashInfoOrderControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const result = await deleteAUserBikashInfoOrderService(_id);

    if (!result) {
      return res.status(404).send({
        status: "Failed",
        message: "Data not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Successfully deleted data",
      data: result,
    });
  } catch (error) {
    console.error("Error in deleteAUserBikashInfoOrderControllers:", error);

    res.status(500).send({
      status: "Failed",
      message: "Failed to delete data",
      data: error.message,
    });
  }
};
