const express = require("express");
const router = express.Router();

const manageOrderButtonControllers = require("../controllers/manageOrderButton.controllers");

// router.route("/user/:email")
//     .get(bikashInfoOrderControllers.getAUserBikashInfoOrdersDataByEmailControllers)

router.route("/:_id")
//     .get(bikashInfoOrderControllers.getAUserBikashInfoOrderControllers)
    .patch(manageOrderButtonControllers.updateOne)
//     .delete(bikashInfoOrderControllers.deleteAUserBikashInfoOrderControllers);

router
  .route("/")
  .post(manageOrderButtonControllers.create)
  .get(manageOrderButtonControllers.getAll);

module.exports = router;
