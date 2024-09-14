const express = require("express");
const router = express.Router();
const onlineBirthCertificateControllers = require("../controllers/onlineBirthCertificate.controllers");

router.route("/user/:email")
    .get(onlineBirthCertificateControllers.getAOnlineBirthCertificateDataByEmailControllers)


router.route("/:_id")
    .get(onlineBirthCertificateControllers.getAOnlineBirthCertificateControllers)
    .patch(onlineBirthCertificateControllers.updateAOnlineBirthCertificateControllers)
    .delete(onlineBirthCertificateControllers.deleteAOnlineBirthCertificateControllers);


router.route("/")
    .post(onlineBirthCertificateControllers.createNewOnlineBirthCertificateControllers)
    .get(onlineBirthCertificateControllers.getAllOnlineBirthCertificateControllers);

    
module.exports = router;