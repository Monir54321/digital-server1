const express = require("express");
const router = express.Router();
const signCopyControllers = require("../controllers/signCopy.controllers");
const uploadPdf = require("../utils/multerConfig");

router
  .route("/user/:email")
  .get(signCopyControllers.getASignCopyDataByEmailControllers);

router
  .route("/:_id")
  .get(signCopyControllers.getASignCopyControllers)
  .patch(
    uploadPdf.single("file"),
    signCopyControllers.updateASignCopyControllers
  )
  .delete(signCopyControllers.deleteASignCopyControllers);

router
  .route("/")
  .post(signCopyControllers.createNewSignCopyControllers)
  .get(signCopyControllers.getAllSignCopyControllers);

module.exports = router;
