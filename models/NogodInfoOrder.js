const { default: mongoose } = require("mongoose");

const nogodInfoOrderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    nogodNumber: {
      type: String,
      required: [true, "Please provide a number"],
      trim: true,
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

const NogodInfoOrder = mongoose.model("NogodInfoOrder", nogodInfoOrderSchema);

module.exports = NogodInfoOrder;
