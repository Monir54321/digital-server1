const { default: mongoose } = require("mongoose");

const biometricOrderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    selectType: {
      type: String,
      required: true,
    },
    biometricNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Canceled", "Success"],
      default: "Pending",
    },
    reason: {
      type: String,
    },
    pdf: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BiometricOrder = mongoose.model("BiometricOrder", biometricOrderSchema);

module.exports = BiometricOrder;
