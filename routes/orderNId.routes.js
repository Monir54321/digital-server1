const express = require("express");
const router = express.Router();

const orderNIdControllers = require("../controllers/orderNID.controllers");

const uploadPdf = require("../utils/multerConfig");

router
  .route("/user/:email")
  .get(orderNIdControllers.getAOrderNIDDataByEmailControllers);

router
  .route("/:_id")
  .patch(
    uploadPdf.single("file"),
    orderNIdControllers.updateAOrderNIDControllers
  )
  .get(orderNIdControllers.getAOrderNIDControllers)
  .delete(orderNIdControllers.deleteAOrderNIDControllers);

router
  .route("/")
  .post(orderNIdControllers.createNewNIDOrderControllers)
  .get(orderNIdControllers.getAllOrderNIDControllers);

module.exports = router;
