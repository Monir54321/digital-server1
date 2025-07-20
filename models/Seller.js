const { default: mongoose } = require("mongoose");

const sellerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    whatsAppNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
    specialization: [
      {
        type: String,
        enum: [
          "NID_ORDER",
          "BIKASH_INFO",
          "BIKASH_PIN_RESET",
          "CALL_LIST",
          "BIRTH_CERTIFICATE_FIX",
          "BIOMETRIC_ORDER",
          "NOGOD_INFO",
          "ONLINE_BIRTH_CERTIFICATE",
          "SAFTY_TIKA",
          "SERVER_COPY",
          "SIGN_COPY",
          "NID_MAKE",
          "NAME_ADDRESSES_LOST_ID",
          "RECHARGE",
          "CUSTOM",
        ],
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    completedOrders: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: Number, // Average response time in minutes
      default: 0,
    },
    availability: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "OFFLINE"],
      default: "AVAILABLE",
    },
    workingHours: {
      start: {
        type: String,
        default: "09:00",
      },
      end: {
        type: String,
        default: "18:00",
      },
    },
    commission: {
      type: Number,
      default: 0, // Commission percentage
    },
    notes: {
      type: String,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
sellerSchema.index({ phone: 1 });
sellerSchema.index({ status: 1 });
sellerSchema.index({ specialization: 1 });

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
