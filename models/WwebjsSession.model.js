const mongoose = require("mongoose");

const WwebjsSessionSchema = new mongoose.Schema(
  {
    session: {
      type: Object, // Stores the full WhatsApp session object
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("WwebjsSession", WwebjsSessionSchema);
