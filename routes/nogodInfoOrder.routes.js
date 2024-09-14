const express = require("express");
const router = express.Router();

const nogodInfoOrderControllers = require("../controllers/nogodInfoOrder.controllers");

router.route("/user/:email")
    .get(nogodInfoOrderControllers.getANogodInfoOrderDataByEmailControllers)

router.route("/:_id")
    .get(nogodInfoOrderControllers.getANogodInfoOrderControllers)
    .patch(nogodInfoOrderControllers.updateANogodInfoOrderControllers)
    .delete(nogodInfoOrderControllers.deleteANogodInfoOrderControllers);


router.route("/")
    .post(nogodInfoOrderControllers.createNewNogodInfoOrderControllers)
    .get(nogodInfoOrderControllers.getAllNogodInfoOrderControllers);

module.exports = router;