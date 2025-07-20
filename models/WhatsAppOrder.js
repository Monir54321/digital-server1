const { default: mongoose } = require("mongoose");

const whatsAppOrderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      required: true,
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
    orderDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "FORWARDED_TO_SELLER",
        "SELLER_ACCEPTED",
        "SELLER_REJECTED",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    price: {
      type: Number,
      required: true,
    },
    sellerPhone: {
      type: String,
    },
    sellerResponse: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
    sellerMessage: {
      type: String,
    },
    sellerResponseTime: {
      type: Date,
    },
    customerMessage: {
      type: String,
    },
    customerResponseTime: {
      type: Date,
    },
    whatsAppMessageId: {
      type: String,
    },
    forwardedToSeller: {
      type: Boolean,
      default: false,
    },
    sellerNotificationSent: {
      type: Boolean,
      default: false,
    },
    customerNotificationSent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    estimatedCompletionTime: {
      type: Date,
    },
    actualCompletionTime: {
      type: Date,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    tags: [String],
    assignedTo: {
      type: String,
    },
    source: {
      type: String,
      enum: ["WHATSAPP", "WEBSITE", "API", "TEST"],
      default: "WHATSAPP",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
whatsAppOrderSchema.index({ orderId: 1 });
whatsAppOrderSchema.index({ customerPhone: 1 });
whatsAppOrderSchema.index({ status: 1 });
whatsAppOrderSchema.index({ createdAt: -1 });

const WhatsAppOrder = mongoose.model("WhatsAppOrder", whatsAppOrderSchema);

module.exports = WhatsAppOrder;
