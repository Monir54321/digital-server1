const { default: mongoose } = require("mongoose");

const callListOrderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    number: {
      type: String,
      required: [true, "Please provide a number"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Canceled", "Success"],
      default: "Pending",
    },
    pdf: {
      type: String,
    },
    email: {
      type: String,
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CallListOrder = mongoose.model("CallListOrder", callListOrderSchema);

module.exports = CallListOrder;
