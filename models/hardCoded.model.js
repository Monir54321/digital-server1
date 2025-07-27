const mongoose = require("mongoose");

const HardCodedSellerSchema = new mongoose.Schema({
  whatsappNumber: { type: String, required: true },
});

const HardcodedSellerModel = mongoose.model(
  "HardcodedSeller",
  HardCodedSellerSchema
);

module.exports = HardcodedSellerModel;
