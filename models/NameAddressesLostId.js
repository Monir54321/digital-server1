const { default: mongoose } = require("mongoose");

const nameAddressesLostIdSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    // selectType: {
    //   type: String,
    //   required: [true, "Please provide a type"],
    // },
    // number: {
    //   type: String,
    //   required: [true, "Please provide the selected type of number"],
    //   trim: true,
    // },
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

const NameAddressesLostId = mongoose.model("NameAddressLost", nameAddressesLostIdSchema);

module.exports = NameAddressesLostId;
