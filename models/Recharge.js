const { default: mongoose } = require("mongoose");

const rechargeSchema = mongoose.Schema(
  {
    customerMsisdn: {
      type: String,
      required: [true, "Please provide a number"],
      trim: true,
    },
    amount: {
      type: String,
      required: [true, "Please provide an amount"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Canceled", "Completed"],
      default: "Pending",
    },
    paymentID: {
      type: String,
    },
    transitionId: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
    },
    paymentSuccessDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Recharge = mongoose.model("Recharge", rechargeSchema);

module.exports = Recharge;
