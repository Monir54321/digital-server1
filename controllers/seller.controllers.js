const {
  createSellerService,
  getAllSellersService,
  getSellerByIdService,
  getSellerByPhoneService,
  updateSellerService,
  updateSellerAvailabilityService,
  updateSellerRatingService,
  deleteSellerService,
  getSellersBySpecializationService,
  getSellerStatisticsService,
} = require("../services/seller.services");

// Create new seller
exports.createSellerController = async (req, res) => {
  try {
    const data = req.body;
    const result = await createSellerService(data);

    res.status(201).json({
      status: "Success",
      message: "Seller created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to create seller",
      error: error.message,
    });
  }
};

// Get all sellers with filters
exports.getAllSellersController = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getAllSellersService(filters);

    res.status(200).json({
      status: "Success",
      message: "Sellers retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve sellers",
      error: error.message,
    });
  }
};

// Get seller by ID
exports.getSellerByIdController = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await getSellerByIdService(sellerId);

    if (!result) {
      return res.status(404).json({
        status: "Failed",
        message: "Seller not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Seller retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve seller",
      error: error.message,
    });
  }
};

// Get seller by phone
exports.getSellerByPhoneController = async (req, res) => {
  try {
    const { phone } = req.params;
    const result = await getSellerByPhoneService(phone);

    if (!result) {
      return res.status(404).json({
        status: "Failed",
        message: "Seller not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Seller retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve seller",
      error: error.message,
    });
  }
};

// Update seller
exports.updateSellerController = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const data = req.body;

    const result = await updateSellerService(sellerId, data);

    res.status(200).json({
      status: "Success",
      message: "Seller updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to update seller",
      error: error.message,
    });
  }
};

// Update seller availability
exports.updateSellerAvailabilityController = async (req, res) => {
  try {
    const { phone } = req.params;
    const { availability } = req.body;

    const result = await updateSellerAvailabilityService(phone, availability);

    res.status(200).json({
      status: "Success",
      message: "Seller availability updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to update seller availability",
      error: error.message,
    });
  }
};

// Update seller rating
exports.updateSellerRatingController = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { rating } = req.body;

    const result = await updateSellerRatingService(sellerId, rating);

    res.status(200).json({
      status: "Success",
      message: "Seller rating updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to update seller rating",
      error: error.message,
    });
  }
};

// Delete seller
exports.deleteSellerController = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await deleteSellerService(sellerId);

    if (!result) {
      return res.status(404).json({
        status: "Failed",
        message: "Seller not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Seller deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to delete seller",
      error: error.message,
    });
  }
};

// Get sellers by specialization
exports.getSellersBySpecializationController = async (req, res) => {
  try {
    const { specialization } = req.params;
    const result = await getSellersBySpecializationService(specialization);

    res.status(200).json({
      status: "Success",
      message: "Sellers by specialization retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve sellers by specialization",
      error: error.message,
    });
  }
};

// Get seller statistics
exports.getSellerStatisticsController = async (req, res) => {
  try {
    const result = await getSellerStatisticsService();

    res.status(200).json({
      status: "Success",
      message: "Seller statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve seller statistics",
      error: error.message,
    });
  }
};
