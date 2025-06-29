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
const { default: mongoose } = require("mongoose");

exports.createNewRechargeControllers = async (req, res) => {
  try {
    const data = req.body;
    console.log("bkash data", data);
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
      message: "Fail to submit bkash payment",
      data: error?.message,
    });
  }
};

exports.callback = async (req, res) => {
  const { paymentID, status } = req.query;
  console.log("global email value", globals.getValue("email"));
  if (status === "cancel" || status === "failure") {
    return res.redirect(
      `https://smartshebav2.vercel.app/dashboard?status=${status}`
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  if (status === "success") {
    try {
      const executePaymentUrl =
        process.env.bkash_execute_payment_url ||
        "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/execute";

      const { data } = await axios.post(
        executePaymentUrl,
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

        const updatedUser = await User.findOneAndUpdate(
          { email: globals.getValue("email") },
          { $inc: { amount: parseInt(data?.amount) } },
          { new: true }
        );
        console.log("Updated User:", updatedUser);

        globals.unsetValue("email");
        await session.commitTransaction();
        await session.endSession();
        return res.redirect(
          `https://smartshebav2.vercel.app/dashboard?status=success&amount=${data?.amount}`
        );
      } else {
        globals.unsetValue("email");
        await session.abortTransaction();
        await session.endSession();
        return res.redirect(
          `https://smartshebav2.vercel.app/dashboard?status=error&message=${data.statusMessage}`
        );
      }
    } catch (error) {
      console.error("Callback error:", error);
      globals.unsetValue("email");
      await session.abortTransaction();
      await session.endSession();
      return res.redirect(
        `https://smartshebav2.vercel.app/dashboard?status=error&message=Payment verification failed`
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
