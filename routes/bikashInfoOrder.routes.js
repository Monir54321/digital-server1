const express = require("express");
const router = express.Router();

const bikashInfoOrderControllers = require("../controllers/bikashInfoOrder.controllers");

router.route("/user/:email")
    .get(bikashInfoOrderControllers.getAUserBikashInfoOrdersDataByEmailControllers)

router.route("/:_id")
    .get(bikashInfoOrderControllers.getAUserBikashInfoOrderControllers)
    .patch(bikashInfoOrderControllers.updateAUserBikashInfoOrderControllers)
    .delete(bikashInfoOrderControllers.deleteAUserBikashInfoOrderControllers);


router.route("/")
    .post(bikashInfoOrderControllers.createNewBikashInfoOrderControllers)
    .get(bikashInfoOrderControllers.getAllBikashInfoOrderControllers);


module.exports = router;
