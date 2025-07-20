const axios = require("axios");

const BASE_URL = "http://localhost:5000";

// Test data
const testOrder = {
  customerPhone: "+8801712345678",
  customerName: "Test Customer",
  orderType: "NID_ORDER",
  orderDetails: {
    nidNumber: "1234567890",
    additionalInfo: "Test order",
  },
  price: 100,
};

// Test functions
async function testProcessOrder() {
  console.log("\n🚀 Testing Process Order...");
  try {
    const response = await axios.post(
      `${BASE_URL}/automation/process-order`,
      testOrder
    );
    console.log("✅ Process Order Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Process Order Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testSellerResponse() {
  console.log("\n📱 Testing Seller Response...");
  try {
    const response = await axios.post(
      `${BASE_URL}/automation/seller-response`,
      {
        orderId: "WO1234567890", // Use the order ID from previous test
        sellerPhone: "+8801812345678",
        response: "ACCEPT",
        sellerMessage: "I can handle this order",
      }
    );
    console.log("✅ Seller Response Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Seller Response Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testForwardFile() {
  console.log("\n📎 Testing Forward File...");
  try {
    const response = await axios.post(`${BASE_URL}/automation/forward-file`, {
      customerPhone: "+8801712345678",
      fileUrl: "https://example.com/test.pdf",
      fileName: "test.pdf",
    });
    console.log("✅ Forward File Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Forward File Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testForwardMessage() {
  console.log("\n💬 Testing Forward Message...");
  try {
    const response = await axios.post(
      `${BASE_URL}/automation/forward-message`,
      {
        sellerPhone: "+8801812345678",
        customerPhone: "+8801712345678",
        message: "Your order is ready for pickup",
      }
    );
    console.log("✅ Forward Message Result:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Forward Message Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testStatus() {
  console.log("\n📊 Testing Status...");
  try {
    const response = await axios.get(`${BASE_URL}/automation/status`);
    console.log("✅ Status Result:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Status Error:", error.response?.data || error.message);
    return null;
  }
}

async function testAutomation() {
  console.log("\n🧪 Testing Automation...");
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
async function runSimpleTests() {
  console.log("🤖 Starting Simple Automation Tests...");
  console.log("=".repeat(50));

  // Test 1: Check status
  await testStatus();

  // Test 2: Test automation
  await testAutomation();

  // Test 3: Process order
  const orderResult = await testProcessOrder();

  // Test 4: Seller response (if order was created)
  if (orderResult?.data?.orderId) {
    await testSellerResponse();
  }

  // Test 5: Forward file
  await testForwardFile();

  // Test 6: Forward message
  await testForwardMessage();

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Simple automation tests completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runSimpleTests().catch(console.error);
}

module.exports = {
  testProcessOrder,
  testSellerResponse,
  testForwardFile,
  testForwardMessage,
  testStatus,
  testAutomation,
  runSimpleTests,
};
