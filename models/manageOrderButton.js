const { default: mongoose } = require("mongoose");

const manageOrderButtonSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const ManageOrderButton = mongoose.model(
  "ManageOrderButton",
  manageOrderButtonSchema
);

module.exports = ManageOrderButton;
