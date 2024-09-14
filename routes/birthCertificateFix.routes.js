const express = require("express");
const router = express.Router();

const birthCertificateFixControllers = require("../controllers/birthCertificateFix.controllers");

router.route('/user/:email')
    .get(birthCertificateFixControllers.getABirthCertificateFixDataByEmailControllers)

router.route("/:_id")
    .get(birthCertificateFixControllers.getABirthCertificateFixControllers)
    .patch(birthCertificateFixControllers.updateABirthCertificateFixControllers)
    .delete(birthCertificateFixControllers.deleteABirthCertificateFixControllers);

router.route("/")
    .get(birthCertificateFixControllers.getAllBirthCertificateFixControllers)
    .post(birthCertificateFixControllers.createNewBirthCertificateFixControllers);

module.exports = router;