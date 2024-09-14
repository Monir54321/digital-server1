const { default: mongoose } = require("mongoose");

const serverCopySchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    nidNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
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

const ServerCopy = mongoose.model("ServerCopy", serverCopySchema);

module.exports = ServerCopy;
