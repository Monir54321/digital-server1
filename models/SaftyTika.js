const { default: mongoose, model } = require("mongoose");

const saftyTikaSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    passportNumber: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Canceled", "Success"],
      default: "Pending",
    },
    description: {
      type: String,
      trim: true,
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

const SaftyTika = mongoose.model("SaftyTika", saftyTikaSchema);

module.exports = SaftyTika;
