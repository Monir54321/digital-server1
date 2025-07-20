const Seller = require("../models/Seller");

// Create new seller
exports.createSellerService = async (data) => {
  try {
    const result = await Seller.create(data);
    return result;
  } catch (error) {
    console.error("Error creating seller:", error);
    throw error;
  }
};

// Get all sellers
exports.getAllSellersService = async (filters = {}) => {
  try {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.specialization) query.specialization = filters.specialization;
    if (filters.availability) query.availability = filters.availability;

    const result = await Seller.find(query).sort({
      rating: -1,
      totalOrders: -1,
    });
    return result;
  } catch (error) {
    console.error("Error getting sellers:", error);
    throw error;
  }
};

// Get seller by ID
exports.getSellerByIdService = async (sellerId) => {
  try {
    const result = await Seller.findById(sellerId);
    return result;
  } catch (error) {
    console.error("Error getting seller by ID:", error);
    throw error;
  }
};

// Get seller by phone
exports.getSellerByPhoneService = async (phone) => {
  try {
    const result = await Seller.findOne({ phone });
    return result;
  } catch (error) {
    console.error("Error getting seller by phone:", error);
    throw error;
  }
};

// Update seller
exports.updateSellerService = async (sellerId, data) => {
  try {
    const result = await Seller.findByIdAndUpdate(
      sellerId,
      { $set: data },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating seller:", error);
    throw error;
  }
};

// Update seller availability
exports.updateSellerAvailabilityService = async (phone, availability) => {
  try {
    const updateData = {
      availability,
      lastActive: new Date(),
    };

    const result = await Seller.findOneAndUpdate(
      { phone },
      { $set: updateData },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating seller availability:", error);
    throw error;
  }
};

// Update seller rating
exports.updateSellerRatingService = async (sellerId, newRating) => {
  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    // Calculate new average rating
    const currentRating = seller.rating;
    const totalOrders = seller.totalOrders;
    const newAverageRating =
      (currentRating * totalOrders + newRating) / (totalOrders + 1);

    const result = await Seller.findByIdAndUpdate(
      sellerId,
      {
        $set: { rating: newAverageRating },
        $inc: { totalOrders: 1 },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating seller rating:", error);
    throw error;
  }
};

// Delete seller
exports.deleteSellerService = async (sellerId) => {
  try {
    const result = await Seller.findByIdAndDelete(sellerId);
    return result;
  } catch (error) {
    console.error("Error deleting seller:", error);
    throw error;
  }
};

// Get sellers by specialization
exports.getSellersBySpecializationService = async (specialization) => {
  try {
    const result = await Seller.find({
      specialization: specialization,
      status: "ACTIVE",
      availability: "AVAILABLE",
    }).sort({ rating: -1, responseTime: 1 });
    return result;
  } catch (error) {
    console.error("Error getting sellers by specialization:", error);
    throw error;
  }
};

// Get seller statistics
exports.getSellerStatisticsService = async () => {
  try {
    const stats = await Seller.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          totalOrders: { $sum: "$totalOrders" },
        },
      },
    ]);

    const totalSellers = await Seller.countDocuments();
    const activeSellers = await Seller.countDocuments({ status: "ACTIVE" });
    const availableSellers = await Seller.countDocuments({
      status: "ACTIVE",
      availability: "AVAILABLE",
    });

    return {
      statusBreakdown: stats,
      totalSellers,
      activeSellers,
      availableSellers,
    };
  } catch (error) {
    console.error("Error getting seller statistics:", error);
    throw error;
  }
};
