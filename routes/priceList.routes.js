const express = require("express");
const router = express.Router();
const priceListControllers = require("../controllers/priceList.controllers");

router.route("/:_id")
    .patch(priceListControllers.updatePriceListControllers)
    .get(priceListControllers.getAPriceListControllers)

router.route("/")
    .post(priceListControllers.createNewPriceListControllers)
    .get(priceListControllers.getPriceListControllers);

module.exports = router;