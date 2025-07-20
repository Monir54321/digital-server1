const express = require("express");
const router = express.Router();

const sellerControllers = require("../controllers/seller.controllers");

// Create new seller
router.post("/", sellerControllers.createSellerController);

// Get all sellers with filters
router.get("/", sellerControllers.getAllSellersController);

// Get seller statistics
router.get("/statistics", sellerControllers.getSellerStatisticsController);

// Get sellers by specialization
router.get(
  "/specialization/:specialization",
  sellerControllers.getSellersBySpecializationController
);

// Get seller by phone
router.get("/phone/:phone", sellerControllers.getSellerByPhoneController);

// Get seller by ID
router.get("/:sellerId", sellerControllers.getSellerByIdController);

// Update seller
router.patch("/:sellerId", sellerControllers.updateSellerController);

// Update seller availability
router.patch(
  "/:phone/availability",
  sellerControllers.updateSellerAvailabilityController
);

// Update seller rating
router.patch(
  "/:sellerId/rating",
  sellerControllers.updateSellerRatingController
);

// Delete seller
router.delete("/:sellerId", sellerControllers.deleteSellerController);

module.exports = router;
