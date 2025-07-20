const axios = require("axios");

const BASE_URL = "http://localhost:5000"; // Change this to your server URL

// Test data
const testOrderData = {
  customerPhone: "+8801712345678",
  customerName: "Test Customer",
  orderType: "NID_ORDER",
  orderDetails: {
    nidNumber: "1234567890",
    additionalInfo: "Test automation order",
  },
  price: 100,
  source: "TEST",
};

const batchOrdersData = [
  {
    customerPhone: "+8801712345678",
    customerName: "Customer 1",
    orderType: "NID_ORDER",
    orderDetails: { nidNumber: "1111111111" },
    price: 100,
  },
  {
    customerPhone: "+8801723456789",
    customerName: "Customer 2",
    orderType: "BIRTH_CERTIFICATE",
    orderDetails: { certificateType: "Birth Certificate" },
    price: 150,
  },
  {
    customerPhone: "+8801734567890",
    customerName: "Customer 3",
    orderType: "BIOMETRIC_ORDER",
    orderDetails: { biometricType: "Fingerprint" },
    price: 200,
  },
];

// Test functions
async function testOneClickAutomation() {
  console.log("\n🚀 Testing One-Click Automation...");
  try {
    const response = await axios.post(`${BASE_URL}/automation/process-order`, {
      ...testOrderData,
      options: {
        autoAccept: true,
        autoComplete: true,
        sendCustomerNotification: true,
        sendSellerNotification: true,
      },
    });

    console.log("✅ One-Click Automation Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ One-Click Automation Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testQuickOrder() {
  console.log("\n⚡ Testing Quick Order...");
  try {
    const response = await axios.post(`${BASE_URL}/automation/quick-order`, {
      customerPhone: "+8801745678901",
      customerName: "Quick Customer",
      orderType: "NID_ORDER",
      orderDetails: { nidNumber: "9999999999" },
      price: 120,
    });

    console.log("✅ Quick Order Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Quick Order Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testBatchProcessing() {
  console.log("\n📦 Testing Batch Processing...");
  try {
    const response = await axios.post(`${BASE_URL}/automation/batch-process`, {
      orders: batchOrdersData,
      options: {
        autoAccept: true,
        autoComplete: false, // Don't auto-complete for testing
        delayBetweenOrders: 1000, // 1 second delay between orders
      },
    });

    console.log("✅ Batch Processing Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Batch Processing Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testAutomationStatus() {
  console.log("\n📊 Testing Automation Status...");
  try {
    const response = await axios.get(`${BASE_URL}/automation/status`);
    console.log("✅ Automation Status:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Status Error:", error.response?.data || error.message);
    return null;
  }
}

async function testStopAutomation() {
  console.log("\n🛑 Testing Stop Automation...");
  try {
    const response = await axios.post(`${BASE_URL}/automation/stop`);
    console.log("✅ Stop Automation Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Stop Automation Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testAutomation() {
  console.log("\n🧪 Testing Automation System...");
  try {
    const response = await axios.post(`${BASE_URL}/automation/test`);
    console.log("✅ Test Automation Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Test Automation Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Main test runner
async function runAllTests() {
  console.log("🤖 Starting Automation System Tests...");
  console.log("=".repeat(50));

  // Test 1: Check automation status
  await testAutomationStatus();

  // Test 2: Test automation system
  await testAutomation();

  // Test 3: One-click automation
  await testOneClickAutomation();

  // Test 4: Quick order
  await testQuickOrder();

  // Test 5: Batch processing
  await testBatchProcessing();

  // Test 6: Stop automation
  await testStopAutomation();

  // Test 7: Final status check
  await testAutomationStatus();

  console.log("\n" + "=".repeat(50));
  console.log("🎉 All automation tests completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testOneClickAutomation,
  testQuickOrder,
  testBatchProcessing,
  testAutomationStatus,
  testStopAutomation,
  testAutomation,
  runAllTests,
};
