const express = require("express");
const router = express.Router();

const saftyTikaControllers = require("../controllers/saftyTika.controllers");

router.route("/user/:email")
    .get(saftyTikaControllers.getAUserSaftyTikaDataByEmailControllers)


router.route("/:_id")
    .get(saftyTikaControllers.getASaftyTikaControllers)
    .patch(saftyTikaControllers.updateASaftyTikaControllers)
    .delete(saftyTikaControllers.deleteASaftyTikaControllers);


router.route("/")
    .post(saftyTikaControllers.createNewSaftyTikaControllers)
    .get(saftyTikaControllers.getAllSaftyTikaControllers);


module.exports = router;