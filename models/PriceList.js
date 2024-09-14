const { default: mongoose } = require("mongoose");

const priceListSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    bikashInfo: {
      type: Number,
      required: true,
    },
    nidOrder: {
      type: Number,
      required: true,
    },
    bikashPinReset: {
      type: Number,
      required: true,
    },
    callListOrder: {
      type: Number,
      required: true,
    },
    birthCertificateFix: {
      type: Number,
      required: true,
    },
    banglalinkBiometricOrder: {
      type: Number,
      required: true,
    },
    grameenBiometricOrder: {
      type: Number,
      required: true,
    },
    robiBiometricOrder: {
      type: Number,
      required: true,
    },
    airtelBiometricOrder: {
      type: Number,
      required: true,
    },
    teletalkBiometricOrder: {
      type: Number,
      required: true,
    },
    nogodInfoOrder: {
      type: Number,
      required: true,
    },
    onlineBirthCertificate: {
      type: Number,
      required: true,
    },
    saftyTika: {
      type: Number,
      required: true,
    },
    serverCopy: {
      type: Number,
      required: true,
    },
    signCopy: {
      type: Number,
      required: true,
    },
    nidMake: {
      type: Number,
      required: true,
    },
    autoNid: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PriceList = mongoose.model("PriceList", priceListSchema);

module.exports = PriceList;
