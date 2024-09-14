const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/users.controllers");

router.route("/bikash")
    .patch(userControllers.updateAUserBkashPaymentControllers)

router.route("/:email")
    .get(userControllers.getAUserDataControllers)
    .patch(userControllers.updateAUserDataControllers)
    .delete(userControllers.deleteAUserDataControllers);
    

router.route("/")
    .post(userControllers.createNewUserControllers)
    .get(userControllers.getAllUsersDataControllers)


module.exports = router;