const {
  getAllWhatsAppOrdersService,
  getOrderStatisticsService,
  getOrdersByCustomerPhoneService,
  getOrdersBySellerPhoneService,
} = require("../services/whatsappOrder.services");

const {
  getAllSellersService,
  getSellerStatisticsService,
} = require("../services/seller.services");

// Get dashboard overview data
exports.getDashboardOverview = async (req, res) => {
  try {
    // Get order statistics
    const orderStats = await getOrderStatisticsService();

    // Get seller statistics
    const sellerStats = await getSellerStatisticsService();

    // Get recent orders (last 10)
    const recentOrders = await getAllWhatsAppOrdersService({ limit: 10 });

    // Get active sellers
    const activeSellers = await getAllSellersService({
      status: "ACTIVE",
      availability: "AVAILABLE",
    });

    const dashboardData = {
      orders: {
        total: orderStats.totalOrders,
        today: orderStats.todayOrders,
        statusBreakdown: orderStats.statusBreakdown,
        recent: recentOrders,
      },
      sellers: {
        total: sellerStats.totalSellers,
        active: sellerStats.activeSellers,
        available: sellerStats.availableSellers,
        statusBreakdown: sellerStats.statusBreakdown,
        activeList: activeSellers,
      },
      summary: {
        pendingOrders:
          orderStats.statusBreakdown.find((s) => s._id === "PENDING")?.count ||
          0,
        processingOrders:
          orderStats.statusBreakdown.find(
            (s) => s._id === "FORWARDED_TO_SELLER"
          )?.count || 0,
        completedOrders:
          orderStats.statusBreakdown.find((s) => s._id === "COMPLETED")
            ?.count || 0,
        totalRevenue: recentOrders.reduce(
          (sum, order) => sum + (order.price || 0),
          0
        ),
      },
    };

    res.status(200).json({
      status: "Success",
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve dashboard data",
      error: error.message,
    });
  }
};

// Get orders with advanced filtering
exports.getOrdersWithFilters = async (req, res) => {
  try {
    const {
      status,
      orderType,
      customerPhone,
      sellerPhone,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filters = {
      status,
      orderType,
      customerPhone,
      sellerPhone,
      dateFrom,
      dateTo,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key]
    );

    const result = await getAllWhatsAppOrdersService(filters);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = result.slice(startIndex, endIndex);

    // Apply sorting
    paginatedOrders.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const response = {
      orders: paginatedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.length / limit),
        totalOrders: result.length,
        hasNextPage: endIndex < result.length,
        hasPrevPage: page > 1,
      },
      filters: filters,
    };

    res.status(200).json({
      status: "Success",
      message: "Orders retrieved successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// Get sellers with advanced filtering
exports.getSellersWithFilters = async (req, res) => {
  try {
    const {
      status,
      specialization,
      availability,
      page = 1,
      limit = 20,
      sortBy = "rating",
      sortOrder = "desc",
    } = req.query;

    const filters = {
      status,
      specialization,
      availability,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key]
    );

    const result = await getAllSellersService(filters);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSellers = result.slice(startIndex, endIndex);

    // Apply sorting
    paginatedSellers.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const response = {
      sellers: paginatedSellers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.length / limit),
        totalSellers: result.length,
        hasNextPage: endIndex < result.length,
        hasPrevPage: page > 1,
      },
      filters: filters,
    };

    res.status(200).json({
      status: "Success",
      message: "Sellers retrieved successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve sellers",
      error: error.message,
    });
  }
};

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const { period = "7d" } = req.query;

    // Get order statistics
    const orderStats = await getOrderStatisticsService();

    // Get seller statistics
    const sellerStats = await getSellerStatisticsService();

    // Calculate revenue (you might want to implement this based on your pricing logic)
    const recentOrders = await getAllWhatsAppOrdersService({ limit: 100 });
    const totalRevenue = recentOrders.reduce(
      (sum, order) => sum + (order.price || 0),
      0
    );

    // Calculate average order value
    const avgOrderValue =
      recentOrders.length > 0 ? totalRevenue / recentOrders.length : 0;

    // Calculate completion rate
    const completedOrders =
      orderStats.statusBreakdown.find((s) => s._id === "COMPLETED")?.count || 0;
    const completionRate =
      orderStats.totalOrders > 0
        ? (completedOrders / orderStats.totalOrders) * 100
        : 0;

    // Calculate average response time (you might want to implement this)
    const avgResponseTime = 15; // minutes (placeholder)

    const analytics = {
      overview: {
        totalOrders: orderStats.totalOrders,
        totalSellers: sellerStats.totalSellers,
        totalRevenue: totalRevenue,
        avgOrderValue: avgOrderValue,
        completionRate: completionRate,
        avgResponseTime: avgResponseTime,
      },
      orders: {
        statusBreakdown: orderStats.statusBreakdown,
        todayOrders: orderStats.todayOrders,
      },
      sellers: {
        statusBreakdown: sellerStats.statusBreakdown,
        activeSellers: sellerStats.activeSellers,
        availableSellers: sellerStats.availableSellers,
      },
      performance: {
        ordersPerDay: orderStats.todayOrders,
        avgRating:
          sellerStats.statusBreakdown.find((s) => s._id === "ACTIVE")
            ?.avgRating || 0,
        totalCompletedOrders: completedOrders,
      },
    };

    res.status(200).json({
      status: "Success",
      message: "Analytics data retrieved successfully",
      data: analytics,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve analytics data",
      error: error.message,
    });
  }
};

// Get customer order history
exports.getCustomerOrderHistory = async (req, res) => {
  try {
    const { customerPhone } = req.params;
    const result = await getOrdersByCustomerPhoneService(customerPhone);

    res.status(200).json({
      status: "Success",
      message: "Customer order history retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve customer order history",
      error: error.message,
    });
  }
};

// Get seller order history
exports.getSellerOrderHistory = async (req, res) => {
  try {
    const { sellerPhone } = req.params;
    const result = await getOrdersBySellerPhoneService(sellerPhone);

    res.status(200).json({
      status: "Success",
      message: "Seller order history retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to retrieve seller order history",
      error: error.message,
    });
  }
};
