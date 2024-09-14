const { default: mongoose } = require("mongoose");

const birthCertificateFixSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    birthCertificateNumber: {
      type: String,
      required: [true, "Please provide the birth certificate number"],
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: [true, "Please provide the date of birth"],
    },
    newBengaliName: {
      type: String,
      required: [true, "Please provide the bengali name"],
    },
    newEnglishName: {
      type: String,
      required: [true, "Please provide the English name"],
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

const BirthCertificateFix = mongoose.model(
  "BirthCertificateFix",
  birthCertificateFixSchema
);

module.exports = BirthCertificateFix;
