// const express = require("express");
// const router = express.Router();
// const callListOrderControllers = require("../controllers/callListOrder.controllers");

// router.route("/user/:email")
//     .get(callListOrderControllers.getACallListOrderDataByEmailControllers)

// router.route("/:_id")
//     .get(callListOrderControllers.getACallListOrderControllers)
//     .patch(callListOrderControllers.updateACallListOrderControllers)
//     .delete(callListOrderControllers.deleteACallListOrderControllers);

// router.route("/")
//     .get(callListOrderControllers.getAllCallListOrderControllers)
//     .post(callListOrderControllers.createNewCallListOrderControllers);

// module.exports = router;

const express = require("express");
const multer = require("multer");
const router = express.Router();
const callListOrderControllers = require("../controllers/callListOrder.controllers");

const uploadPdf = require("../utils/multerConfig");

// Existing routes
router
  .route("/user/:email")
  .get(callListOrderControllers.getACallListOrderDataByEmailControllers);

router
  .route("/:_id")
  .get(callListOrderControllers.getACallListOrderControllers)
  .patch(
    uploadPdf.single("file"),
    callListOrderControllers.updateACallListOrderControllers
  )
  .delete(callListOrderControllers.deleteACallListOrderControllers);

router
  .route("/")
  .get(callListOrderControllers.getAllCallListOrderControllers)
  .post(callListOrderControllers.createNewCallListOrderControllers);

module.exports = router;
