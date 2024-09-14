const { default: axios } = require("axios");
const {
  createNewRechargeService,
  getAllRechargeService,
  getARechargeService,
  updateARechargeService,
  deleteARechargeService,
} = require("../services/recharge.services");

const bkash_headers = require("../utils/bkashHeaders");
const Recharge = require("../models/Recharge");
const globals = require("node-global-storage");
const User = require("../models/User");

exports.createNewRechargeControllers = async (req, res) => {
  try {
    const data = req.body;
    globals.setValue("email", data?.email, { protected: true });
    const result = await createNewRechargeService(data);

    res.status(200).send({
      status: "Success",
      message: "Successfully submitted",
      data: result,
    });
  } catch (error) {
    res.status(401).send({
      status: "Failed",
      message: "Failed to send your request",
      data: error?.message,
    });
  }
};

exports.callback = async (req, res) => {
  const { paymentID, status } = req.query;

  if (status === "cancel" || status === "failure") {
    return res.redirect(`${process.env.frontendUrl}/error?message=${status}`);
  }

  if (status === "success") {
    try {
      const { data } = await axios.post(
        process.env.bkash_execute_payment_url,
        { paymentID },
        {
          headers: await bkash_headers(),
        }
      );

      if (data && data.statusCode === "0000") {
        //const userId = globals.get('userId')
        await Recharge.create({
          customerMsisdn: data?.customerMsisdn,
          paymentID,
          transitionId: data?.trxID,
          paymentSuccessDate: data?.paymentExecuteTime,
          amount: parseInt(data?.amount),
          email: globals.getValue("email"),
          status: data?.transactionStatus,
        });

        await User.findOneAndUpdate(
          { email: globals.getValue("email") },
          { $inc: { amount: parseInt(data?.amount) } },
          { new: true }
        );

        globals.unsetValue("email");

        return res.redirect(`${process.env.frontendUrl}/success`);
      } else {
        return res.redirect(
          `${process.env.frontendUrl}/error?message=${data.statusMessage}`
        );
      }
    } catch (error) {
      console.log(error);
      return res.redirect(
        `${process.env.frontendUrl}/error?message=${error.message}`
      );
    }
  }
};

exports.getAllRechargeControllers = async (req, res) => {
  try {
    const result = await getAllRechargeService();

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

exports.getARechargeControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const result = await getARechargeService(_id);

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

exports.updateARechargeControllers = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = req.body;
    const result = await updateARechargeService({ _id, data });

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

exports.deleteARechargeControllers = async (req, res) => {
  try {
    const _id = req.params._id;

    const result = await deleteARechargeService(_id);

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
