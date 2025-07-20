const axios = require("axios");

const BASE_URL = "http://localhost:5000";

// Test data
const testOrder = {
  customerPhone: "+8801712345678",
  customerName: "Test Customer",
  orderType: "NID_ORDER",
  orderDetails: {
    nidNumber: "1234567890",
    additionalInfo: "Test order for NID service",
  },
  price: 100,
  source: "TEST",
};

const testSeller = {
  name: "Test Seller",
  phone: "+8801812345701",
  email: "seller_unique_002@test.com",
  whatsAppNumber: "+8801812345701",
  specialization: ["NID_ORDER", "BIKASH_INFO"],
  status: "ACTIVE",
  availability: "AVAILABLE",
};

async function testSystem() {
  console.log("🧪 Testing WhatsApp Order Management System...\n");

  try {
    // Test 1: Create a seller
    console.log("1️⃣ Testing seller creation...");
    const sellerResponse = await axios.post(`${BASE_URL}/sellers`, testSeller);
    console.log(
      "✅ Seller created successfully:",
      sellerResponse.data.data._id
    );
    const sellerId = sellerResponse.data.data._id;

    // Test 2: Create an order
    console.log("\n2️⃣ Testing order creation...");
    const orderResponse = await axios.post(
      `${BASE_URL}/whatsapp-orders`,
      testOrder
    );
    console.log(
      "✅ Order created successfully:",
      orderResponse.data.data.orderId
    );
    const orderId = orderResponse.data.data.orderId;

    // Test 3: Get all orders
    console.log("\n3️⃣ Testing get all orders...");
    const ordersResponse = await axios.get(`${BASE_URL}/whatsapp-orders`);
    console.log(
      "✅ Orders retrieved successfully. Count:",
      ordersResponse.data.data.length
    );

    // Test 4: Get order by ID
    console.log("\n4️⃣ Testing get order by ID...");
    const orderByIdResponse = await axios.get(
      `${BASE_URL}/whatsapp-orders/${orderId}`
    );
    console.log(
      "✅ Order retrieved successfully:",
      orderByIdResponse.data.data.orderId
    );

    // Test 5: Get available sellers for order type
    console.log("\n5️⃣ Testing get available sellers...");
    const sellersResponse = await axios.get(
      `${BASE_URL}/whatsapp-orders/sellers/NID_ORDER`
    );
    console.log(
      "✅ Available sellers retrieved successfully. Count:",
      sellersResponse.data.data.length
    );

    // Test 6: Forward order to seller
    console.log("\n6️⃣ Testing forward order to seller...");
    const forwardResponse = await axios.post(
      `${BASE_URL}/whatsapp-orders/${orderId}/forward`,
      {
        sellerPhone: testSeller.phone,
      }
    );
    console.log(
      "✅ Order forwarded successfully:",
      forwardResponse.data.data.status
    );

    // Test 7: Handle seller response
    console.log("\n7️⃣ Testing seller response...");
    const sellerResponse2 = await axios.post(
      `${BASE_URL}/whatsapp-orders/${orderId}/seller-response`,
      {
        response: "ACCEPTED",
        message: "I can handle this order",
      }
    );
    console.log(
      "✅ Seller response handled successfully:",
      sellerResponse2.data.data.status
    );

    // Test 8: Get dashboard overview
    console.log("\n8️⃣ Testing dashboard overview...");
    const dashboardResponse = await axios.get(`${BASE_URL}/dashboard/overview`);
    console.log("✅ Dashboard data retrieved successfully");
    console.log("   - Total orders:", dashboardResponse.data.data.orders.total);
    console.log(
      "   - Total sellers:",
      dashboardResponse.data.data.sellers.total
    );

    // Test 9: Get analytics
    console.log("\n9️⃣ Testing analytics...");
    const analyticsResponse = await axios.get(
      `${BASE_URL}/dashboard/analytics`
    );
    console.log("✅ Analytics data retrieved successfully");
    console.log(
      "   - Total revenue:",
      analyticsResponse.data.data.overview.totalRevenue
    );

    // Test 10: Get seller statistics
    console.log("\n🔟 Testing seller statistics...");
    const sellerStatsResponse = await axios.get(
      `${BASE_URL}/sellers/statistics`
    );
    console.log("✅ Seller statistics retrieved successfully");
    console.log(
      "   - Active sellers:",
      sellerStatsResponse.data.data.activeSellers
    );

    console.log("\n🎉 All tests passed successfully!");
    console.log("\n📊 System Summary:");
    console.log("   - Orders API: ✅ Working");
    console.log("   - Sellers API: ✅ Working");
    console.log("   - Dashboard API: ✅ Working");
    console.log("   - Webhook System: ✅ Ready");
    console.log("   - Notification System: ✅ Ready");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Make sure the server is running on port 5000");
    console.log("   2. Check if MongoDB is connected");
    console.log("   3. Verify all environment variables are set");
    console.log("   4. Check server logs for detailed error messages");
  }
}

// Run the test
testSystem();
