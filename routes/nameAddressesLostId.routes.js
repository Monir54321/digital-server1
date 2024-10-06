const express = require("express");
const router = express.Router();
const nameAddressesLostIdControllers = require("../controllers/nameAddressesLostId.controllers");
const uploadPdf = require("../utils/multerConfig");

router
  .route("/user/:email")
  .get(nameAddressesLostIdControllers.getNameAddressLossDataByEmailControllers);

router
  .route("/:_id")
  .get(nameAddressesLostIdControllers.getASignCopyControllers)
  .patch(
    uploadPdf.single("file"),
    nameAddressesLostIdControllers.updateNameAddressLossControllers
  )
  .delete(nameAddressesLostIdControllers.delete);

router
  .route("/")
  .post(nameAddressesLostIdControllers.createNameAddressesLostIdControllers)
  .get(nameAddressesLostIdControllers.getAllNameAddressLostControllers);

module.exports = router;
