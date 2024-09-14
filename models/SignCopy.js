const { default: mongoose } = require("mongoose");

const signCopySchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    selectedType: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
    },
    nameDob: {
      type: String,
      required: true,
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
      required: true,
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SignCopy = mongoose.model("SignCopy", signCopySchema);

module.exports = SignCopy;
