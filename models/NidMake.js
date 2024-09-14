const { default: mongoose } = require("mongoose");

const nidMakeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    nameBangla: {
      type: String,
      required: true,
      trim: true,
    },
    nameEnglish: {
      type: String,
      required: true,
      trim: true,
    },
    idNumber: {
      type: String,
      required: true,
      trim: true,
    },
    pinNumber: {
      type: String,
      required: true,
      trim: true,
    },
    fatherNameBangla: {
      type: String,
      required: true,
      trim: true,
    },
    husbandWifeName: {
      type: String,
      required: false,
      trim: true,
    },
    motherName: {
      type: String,
      required: true,
      trim: true,
    },
    birthLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
      trim: true,
    },
    applyDate: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    location: {
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

const NidMake = mongoose.model("NidMake", nidMakeSchema);

module.exports = NidMake;
