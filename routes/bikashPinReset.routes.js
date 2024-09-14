const express = require("express");
const router = express.Router();

const bikashPinResetControllers = require("../controllers/bikashPinReset.controllers");

router.route("/user/:email")
    .get(bikashPinResetControllers.getABikashPinResetDataByEmailControllers)

router.route("/:_id")
    .get(bikashPinResetControllers.getABikashPinResetControllers)
    .patch(bikashPinResetControllers.updateABikashPinResetControllers)
    .delete(bikashPinResetControllers.deleteABikashPinResetControllers);

    

router.route("/")
    .post(bikashPinResetControllers.createNewBikashPinResetControllers)
    .get(bikashPinResetControllers.getAllBikashPinResetControllers);

module.exports = router;