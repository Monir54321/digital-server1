const express = require("express");
const router = express.Router();

const biometricOrderControllers = require("../controllers/biometricOrder.controllers");

router.route("/user/:email")
    .get(biometricOrderControllers.getABiometricOrderDataByEmailControllers)


router.route("/:_id")
    .get(biometricOrderControllers.getABiometricOrderControllers)
    .patch(biometricOrderControllers.updateABiometricOrderControllers)
    .delete(biometricOrderControllers.deleteABiometricOrderControllers);


router.route("/")
    .post(biometricOrderControllers.createNewBiometricOrderControllers)
    .get(biometricOrderControllers.getAllBiometricOrderControllers);

module.exports = router;