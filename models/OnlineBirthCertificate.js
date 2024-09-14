const { default: mongoose } = require("mongoose");

const onlineBirthCertificateSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    bengaliName: {
      type: String,
      required: [true, "Please provide a bengali name"],
      trim: true,
    },
    englishName: {
      type: String,
      required: [true, "Please provide an english name"],
      trim: true,
    },
    bornSerialNumber: {
      type: String,
      required: [true, "Please provide a born serial number"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Please provide a gender"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Please provide a mobile number"],
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: [true, "Please provide a date of birth"],
      trim: true,
    },
    bivag: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    jela: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    upojela: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    powrosova: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    wordNumber: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    dakghor: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    postOffice: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    gram: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    villageEnglish: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    fatherNameBengali: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    fatherNameEnglish: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    fatherNIDNumber: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    fatherBirthCertificateNumber: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    motherNameBengali: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    motherNameEnglish: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    motherNIDNumber: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    motherBirthCertificateNumber: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    bornLocation: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    permanentAddressBangla: {
      type: String,
      required: [true, "This felid is required"],
      trim: true,
    },
    whatsAppNumber: {
      type: String,
      required: [true, "This felid is required"],
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

const OnlineBirthCertificate = mongoose.model(
  "OnlineBirthCertificate",
  onlineBirthCertificateSchema
);

module.exports = OnlineBirthCertificate;
