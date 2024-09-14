const express = require("express");
const router = express.Router();
const rechargeControllers = require("../controllers/recharge.controllers");
const bkashAuth = require("../middleware/middleware");

router
  .route("/payment/create")
  .post(bkashAuth, rechargeControllers.createNewRechargeControllers)
  .get(rechargeControllers.getAllRechargeControllers);

router.route("/payment/callback").get(rechargeControllers.callback);

module.exports = router;
