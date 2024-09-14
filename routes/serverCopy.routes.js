const express = require("express");
const router = express.Router();
const serverCopyControllers = require("../controllers/serverCopy.controllers")


router.route("/user/:email")
    .get(serverCopyControllers.getAServerCopyDataByEmailControllers)


router.route("/:_id")
    .get(serverCopyControllers.getAServerCopyControllers)
    .patch(serverCopyControllers.updateAServerCopyControllers)
    .delete(serverCopyControllers.deleteAServerCopyControllers);


router.route("/")
    .post(serverCopyControllers.createNewServerCopyControllers)
    .get(serverCopyControllers.getAllServerCopyControllers);


module.exports = router;