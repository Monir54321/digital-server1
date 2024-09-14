const { default: mongoose } = require("mongoose");

const bikashInfoOrderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    reason: {
      type: String,
    },
    bikashNumber: {
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
      enum: ["Pending", "Processing", "Success"],
      default: "Pending",
    },
    pdf: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BikashInfoOrder = mongoose.model(
  "BikashInfoOrder",
  bikashInfoOrderSchema
);

module.exports = BikashInfoOrder;
