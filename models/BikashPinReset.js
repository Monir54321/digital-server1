const { default: mongoose } = require("mongoose");

const bikashPinResetSchema = mongoose.Schema(
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
    whatsAppNumber: {
      type: String,
      required: [true, "Please provide a number"],
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

const BikashPinReset = mongoose.model("BikashPinReset", bikashPinResetSchema);

module.exports = BikashPinReset;
