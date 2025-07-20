# WhatsApp Order Management System - API Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Testing with Postman](#testing-with-postman)
6. [WhatsApp Integration](#whatsapp-integration)
7. [Error Handling](#error-handling)
8. [Examples](#examples)

---

## 🚀 Overview

A comprehensive WhatsApp order management system that automatically processes orders, forwards them to sellers, and provides real-time status updates.

### System Flow

```
Customer WhatsApp → PDF Upload → System Process → Seller Notification → Status Update
```

### Key Features

- ✅ PDF-only order processing
- ✅ Automatic seller assignment
- ✅ Simple status indicators (✅/❌)
- ✅ Real-time notifications
- ✅ Dashboard analytics

---

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root:

```env
# Database
DATABASE=mongodb://localhost:27017/whatsapp-orders

# WhatsApp API (Meta/Facebook)
WHATSAPP_API_URL=https://graph.facebook.com/v17.0
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token

# Server
PORT=5000
NODE_ENV=development
BASE_URL=https://your-domain.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Server

```bash
npm run dev
```

### 4. Test System

```bash
node test-system.js
```

---

## 🔐 Authentication

Currently, the system doesn't require authentication for basic operations. For production, implement JWT authentication.

---

## 📡 API Endpoints

### Base URL

```
http://localhost:5000
```

---

## 🛒 WhatsApp Orders

### Create New Order

**POST** `/whatsapp-orders`

**Description:** Create a new WhatsApp order

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "customerPhone": "+8801712345678",
  "customerName": "John Doe",
  "orderType": "NID_ORDER",
  "orderDetails": {
    "nidNumber": "1234567890",
    "additionalInfo": "Additional order details"
  },
  "price": 100,
  "source": "WHATSAPP"
}
```

**Response (Success - 201):**

```json
{
  "status": "Success",
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderId": "ORD-1234567890-ABC123",
    "customerPhone": "+8801712345678",
    "customerName": "John Doe",
    "orderType": "NID_ORDER",
    "status": "PENDING",
    "price": 100,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Orders

**GET** `/whatsapp-orders`

**Description:** Retrieve all orders with optional filters

**Query Parameters:**

- `status` (optional): Filter by status (PENDING, FORWARDED_TO_SELLER, SELLER_ACCEPTED, SELLER_REJECTED, COMPLETED, CANCELLED)
- `orderType` (optional): Filter by order type
- `customerPhone` (optional): Filter by customer phone
- `dateFrom` (optional): Filter from date (YYYY-MM-DD)
- `dateTo` (optional): Filter to date (YYYY-MM-DD)

**Example:**

```
GET /whatsapp-orders?status=PENDING&orderType=NID_ORDER
```

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Orders retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderId": "ORD-1234567890-ABC123",
      "customerPhone": "+8801712345678",
      "customerName": "John Doe",
      "orderType": "NID_ORDER",
      "status": "PENDING",
      "price": 100,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Order by ID

**GET** `/whatsapp-orders/{orderId}`

**Description:** Retrieve a specific order by its ID

**Example:**

```
GET /whatsapp-orders/ORD-1234567890-ABC123
```

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Order retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderId": "ORD-1234567890-ABC123",
    "customerPhone": "+8801712345678",
    "customerName": "John Doe",
    "orderType": "NID_ORDER",
    "orderDetails": {
      "nidNumber": "1234567890"
    },
    "status": "PENDING",
    "price": 100,
    "attachments": [
      {
        "fileName": "document.pdf",
        "fileUrl": "/files/document.pdf",
        "fileType": "application/pdf"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Order Status

**PATCH** `/whatsapp-orders/{orderId}/status`

**Description:** Update the status of an order

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "COMPLETED",
  "notes": "Order completed successfully"
}
```

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Order status updated successfully",
  "data": {
    "orderId": "ORD-1234567890-ABC123",
    "status": "COMPLETED",
    "notes": "Order completed successfully"
  }
}
```

### Forward Order to Seller

**POST** `/whatsapp-orders/{orderId}/forward`

**Description:** Forward an order to a specific seller

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "sellerPhone": "+8801812345678"
}
```

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Order forwarded to seller successfully",
  "data": {
    "orderId": "ORD-1234567890-ABC123",
    "status": "FORWARDED_TO_SELLER",
    "sellerPhone": "+8801812345678"
  }
}
```

### Handle Seller Response

**POST** `/whatsapp-orders/{orderId}/seller-response`

**Description:** Process seller's response (accept/reject)

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "response": "ACCEPTED",
  "message": "I can handle this order"
}
```

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Seller response handled successfully",
  "data": {
    "orderId": "ORD-1234567890-ABC123",
    "status": "SELLER_ACCEPTED",
    "sellerResponse": "ACCEPTED"
  }
}
```

### Get Available Sellers

**GET** `/whatsapp-orders/sellers/{orderType}`

**Description:** Get available sellers for a specific order type

**Example:**

```
GET /whatsapp-orders/sellers/NID_ORDER
```

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Available sellers retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Test Seller",
      "phone": "+8801812345678",
      "specialization": ["NID_ORDER"],
      "rating": 4.5,
      "availability": "AVAILABLE"
    }
  ]
}
```

### Delete Order

**DELETE** `/whatsapp-orders/{orderId}`

**Description:** Delete an order

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Order deleted successfully",
  "data": {
    "orderId": "ORD-1234567890-ABC123"
  }
}
```

---

## 👥 Sellers

### Create New Seller

**POST** `/sellers`

**Description:** Create a new seller

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Test Seller",
  "phone": "+8801812345678",
  "email": "seller@test.com",
  "whatsAppNumber": "+8801812345678",
  "specialization": ["NID_ORDER", "BIKASH_INFO"],
  "status": "ACTIVE",
  "availability": "AVAILABLE"
}
```

**Response (Success - 201):**

```json
{
  "status": "Success",
  "message": "Seller created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Test Seller",
    "phone": "+8801812345678",
    "email": "seller@test.com",
    "specialization": ["NID_ORDER", "BIKASH_INFO"],
    "status": "ACTIVE",
    "availability": "AVAILABLE"
  }
}
```

### Get All Sellers

**GET** `/sellers`

**Description:** Retrieve all sellers with optional filters

**Query Parameters:**

- `status` (optional): Filter by status (ACTIVE, INACTIVE, SUSPENDED)
- `specialization` (optional): Filter by specialization
- `availability` (optional): Filter by availability (AVAILABLE, BUSY, OFFLINE)

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Sellers retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Test Seller",
      "phone": "+8801812345678",
      "email": "seller@test.com",
      "specialization": ["NID_ORDER"],
      "rating": 4.5,
      "totalOrders": 10,
      "completedOrders": 8,
      "availability": "AVAILABLE"
    }
  ]
}
```

### Get Seller by ID

**GET** `/sellers/{sellerId}`

**Description:** Retrieve a specific seller by ID

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Seller retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Test Seller",
    "phone": "+8801812345678",
    "email": "seller@test.com",
    "specialization": ["NID_ORDER"],
    "rating": 4.5,
    "totalOrders": 10,
    "completedOrders": 8,
    "availability": "AVAILABLE"
  }
}
```

### Update Seller

**PATCH** `/sellers/{sellerId}`

**Description:** Update seller information

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "rating": 4.8,
  "availability": "BUSY"
}
```

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Seller updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "rating": 4.8,
    "availability": "BUSY"
  }
}
```

### Update Seller Availability

**PATCH** `/sellers/{phone}/availability`

**Description:** Update seller availability status

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "availability": "OFFLINE"
}
```

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Seller availability updated successfully",
  "data": {
    "phone": "+8801812345678",
    "availability": "OFFLINE"
  }
}
```

### Delete Seller

**DELETE** `/sellers/{sellerId}`

**Description:** Delete a seller

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Seller deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012"
  }
}
```

---

## 📊 Dashboard

### Get Dashboard Overview

**GET** `/dashboard/overview`

**Description:** Get dashboard overview data

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Dashboard data retrieved successfully",
  "data": {
    "orders": {
      "total": 100,
      "today": 5,
      "statusBreakdown": [
        {
          "_id": "PENDING",
          "count": 20
        },
        {
          "_id": "COMPLETED",
          "count": 80
        }
      ],
      "recent": [...]
    },
    "sellers": {
      "total": 10,
      "active": 8,
      "available": 5,
      "statusBreakdown": [...],
      "activeList": [...]
    },
    "summary": {
      "pendingOrders": 20,
      "processingOrders": 15,
      "completedOrders": 80,
      "totalRevenue": 5000
    }
  }
}
```

### Get Analytics

**GET** `/dashboard/analytics`

**Description:** Get analytics data

**Query Parameters:**

- `period` (optional): Time period (7d, 30d, 90d)

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Analytics data retrieved successfully",
  "data": {
    "overview": {
      "totalOrders": 100,
      "totalSellers": 10,
      "totalRevenue": 5000,
      "avgOrderValue": 50,
      "completionRate": 80,
      "avgResponseTime": 15
    },
    "orders": {
      "statusBreakdown": [...],
      "todayOrders": 5
    },
    "sellers": {
      "statusBreakdown": [...],
      "activeSellers": 8,
      "availableSellers": 5
    },
    "performance": {
      "ordersPerDay": 5,
      "avgRating": 4.5,
      "totalCompletedOrders": 80
    }
  }
}
```

### Get Orders with Filters

**GET** `/dashboard/orders`

**Description:** Get orders with advanced filtering and pagination

**Query Parameters:**

- `status` (optional): Order status
- `orderType` (optional): Order type
- `customerPhone` (optional): Customer phone
- `sellerPhone` (optional): Seller phone
- `dateFrom` (optional): Start date
- `dateTo` (optional): End date
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc/desc, default: desc)

**Response (Success - 200):**

```json
{
  "status": "Success",
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalOrders": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "status": "PENDING"
    }
  }
}
```

---

## 🔗 WhatsApp Webhook

### Webhook Verification

**GET** `/whatsapp-webhook`

**Description:** Verify webhook with Meta/Facebook

**Query Parameters:**

- `hub.mode`: subscribe
- `hub.verify_token`: Your verify token
- `hub.challenge`: Challenge string

**Response (Success - 200):**

```
challenge_string
```

### Process WhatsApp Messages

**POST** `/whatsapp-webhook`

**Description:** Process incoming WhatsApp messages

**Headers:**

```
Content-Type: application/json
```

**Request Body (Text Message):**

```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "+8801712345678",
                "text": {
                  "body": "Hi, I need NID service. My name is John Doe. NID: 1234567890"
                },
                "timestamp": "1234567890",
                "id": "msg_123"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

**Request Body (PDF Message):**

```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "+8801712345678",
                "text": {
                  "body": "Hi, I need NID service. My name is John Doe. NID: 1234567890"
                },
                "document": {
                  "id": "doc_123",
                  "filename": "customer_document.pdf",
                  "mime_type": "application/pdf"
                },
                "timestamp": "1234567890",
                "id": "msg_123"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

**Response (Success - 200):**

```json
{
  "status": "ok"
}
```

---

## 🧪 Testing with Postman

### 1. Import Collection

1. Open Postman
2. Click "Import"
3. Create a new collection called "WhatsApp Order System"

### 2. Test Order Flow

1. **Create Seller**
   ```
   POST http://localhost:5000/sellers
   ```
2. **Create Order**
   ```
   POST http://localhost:5000/whatsapp-orders
   ```
3. **Get Orders**
   ```
   GET http://localhost:5000/whatsapp-orders
   ```
4. **Forward to Seller**
   ```
   POST http://localhost:5000/whatsapp-orders/{orderId}/forward
   ```
5. **Seller Response**
   ```
   POST http://localhost:5000/whatsapp-orders/{orderId}/seller-response
   ```

### 3. Test Dashboard

1. **Dashboard Overview**
   ```
   GET http://localhost:5000/dashboard/overview
   ```
2. **Analytics**
   ```
   GET http://localhost:5000/dashboard/analytics
   ```

### 4. Test Webhook

1. **Webhook Verification**
   ```
   GET http://localhost:5000/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test
   ```
2. **Process Message**
   ```
   POST http://localhost:5000/whatsapp-webhook
   ```

---

## 📱 WhatsApp Integration

### Setup with Meta/Facebook

1. Go to [Meta Developer Console](https://developers.facebook.com/)
2. Create a WhatsApp Business App
3. Configure webhook URL: `https://your-domain.com/whatsapp-webhook`
4. Set verify token in environment variables
5. Subscribe to messages webhook

### Message Flow

1. **Customer sends message** → Meta API → Your webhook
2. **System processes** → Creates order → Finds seller
3. **Seller notified** → Responds → Status updated
4. **Customer notified** → Gets status indicator

### Status Indicators

- **Order Created:** `📋 ORD-1234567890-ABC123`
- **Order Accepted:** `✅ ORD-1234567890-ABC123`
- **Order Rejected:** `❌ ORD-1234567890-ABC123`
- **Order Completed:** `✅ ORD-1234567890-ABC123`

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**

```json
{
  "status": "Failed",
  "message": "Failed to create order",
  "error": "Validation error details"
}
```

**404 Not Found:**

```json
{
  "status": "Failed",
  "message": "Order not found"
}
```

**500 Internal Server Error:**

```json
{
  "status": "Failed",
  "message": "Internal server error",
  "error": "Error details"
}
```

### Error Codes

- `E11000`: Duplicate key error (phone/email already exists)
- `ValidationError`: Invalid data format
- `CastError`: Invalid ID format
- `NetworkError`: Database connection issues

---

## 📝 Examples

### Complete Order Flow Example

1. **Create Seller:**

```bash
curl -X POST http://localhost:5000/sellers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Seller",
    "phone": "+8801812345678",
    "email": "seller@test.com",
    "whatsAppNumber": "+8801812345678",
    "specialization": ["NID_ORDER"],
    "status": "ACTIVE",
    "availability": "AVAILABLE"
  }'
```

2. **Create Order:**

```bash
curl -X POST http://localhost:5000/whatsapp-orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerPhone": "+8801712345678",
    "customerName": "John Doe",
    "orderType": "NID_ORDER",
    "orderDetails": {
      "nidNumber": "1234567890"
    },
    "price": 100,
    "source": "WHATSAPP"
  }'
```

3. **Forward to Seller:**

```bash
curl -X POST http://localhost:5000/whatsapp-orders/ORD-1234567890-ABC123/forward \
  -H "Content-Type: application/json" \
  -d '{
    "sellerPhone": "+8801812345678"
  }'
```

4. **Seller Accepts:**

```bash
curl -X POST http://localhost:5000/whatsapp-orders/ORD-1234567890-ABC123/seller-response \
  -H "Content-Type: application/json" \
  -d '{
    "response": "ACCEPTED",
    "message": "I can handle this order"
  }'
```

---

## 🔧 Troubleshooting

### Common Issues

1. **Server not starting:**

   - Check if MongoDB is running
   - Verify environment variables
   - Check port availability

2. **Database connection issues:**

   - Verify DATABASE URL in .env
   - Check MongoDB service status
   - Ensure network connectivity

3. **Webhook not receiving messages:**

   - Verify webhook URL is accessible
   - Check verify token matches
   - Ensure HTTPS for production

4. **File upload issues:**
   - Check files directory permissions
   - Verify file size limits
   - Ensure proper MIME types

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=whatsapp-order-system:*
```

---

## 📞 Support

For technical support:

- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Test individual endpoints with Postman
- Review the troubleshooting section above

---

**Built with ❤️ using Node.js, Express, MongoDB, and WhatsApp Business API**
