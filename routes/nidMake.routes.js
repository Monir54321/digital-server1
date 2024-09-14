const express = require("express");
const router = express.Router();
const {
  createNewNidMakeControllers,
  deleteANidMakeControllers,
  getANidMakeControllers,
  getANidMakeDataByEmailControllers,
  getAllNidMakeControllers,
  updateANidMakeControllers,
} = require("../controllers/nidMake.controllers");

router
  .route("/user/:email")
  .get(getANidMakeDataByEmailControllers);

router
  .route("/:_id")
  .get(getANidMakeControllers)
  .patch(updateANidMakeControllers)
  .delete(deleteANidMakeControllers);

router
  .route("/")
  .post(createNewNidMakeControllers)
  .get(getAllNidMakeControllers);

module.exports = router;
