# WhatsApp Order Management System

A comprehensive order management system that integrates WhatsApp messaging with automated order processing, seller management, and real-time notifications.

## 🚀 System Overview

```
Customer ───▶ │ WhatsApp 🟢│ ─────▶ │ Webhook/API 🧠│
              └────────────┘         └────┬─────────┘
                                         ▼
                                 Create Order in DB 📦
                                         │
         ┌────────────┐   Forward to seller 🔄   ┌────────────┐
         │ Website 🛒 │ ───────────────────────▶ │ Seller 🧑‍🔧 │
         └────────────┘                         └────────────┘
                                         ▼
                              Seller Replies ✅ / ❌
                                         ▼
                             Confirmed / Invalid Status
                                         ▼
                              Auto-send Result to Buyer 📲
```

## 📋 Features

### 🔄 Automated Order Processing

- **WhatsApp Integration**: Receive orders directly via WhatsApp messages
- **Smart Parsing**: Automatically extract order details from customer messages
- **Order Creation**: Generate unique order IDs and store in database
- **Status Tracking**: Real-time order status updates

### 👥 Seller Management

- **Seller Profiles**: Complete seller information with specializations
- **Availability Tracking**: Real-time seller availability status
- **Rating System**: Track seller performance and ratings
- **Specialization Matching**: Automatically match orders to qualified sellers

### 📊 Dashboard & Analytics

- **Real-time Dashboard**: Live order and seller statistics
- **Advanced Filtering**: Filter orders by status, type, date, etc.
- **Analytics**: Revenue tracking, completion rates, response times
- **Order History**: Complete order tracking for customers and sellers

### 🔔 Automated Notifications

- **Customer Notifications**: Order confirmations, status updates, completions
- **Seller Notifications**: New order alerts, response confirmations
- **Reminders**: Automatic reminders for pending responses
- **Multi-channel**: WhatsApp messaging with customizable templates

## 🛠️ Technical Architecture

### Database Models

#### WhatsAppOrder

```javascript
{
  orderId: String,           // Unique order identifier
  customerPhone: String,     // Customer's phone number
  customerName: String,      // Customer's name
  orderType: String,         // Type of service requested
  orderDetails: Object,      // Service-specific details
  status: String,            // Order status
  price: Number,             // Order price
  sellerPhone: String,       // Assigned seller's phone
  sellerResponse: String,    // Seller's response (ACCEPT/REJECT)
  sellerMessage: String,     // Additional seller message
  forwardedToSeller: Boolean, // Whether order was forwarded
  attachments: Array,        // File attachments
  source: String,            // Order source (WHATSAPP/WEBSITE/API)
  timestamps: Object         // Created/updated timestamps
}
```

#### Seller

```javascript
{
  name: String,              // Seller's name
  phone: String,             // Seller's phone number
  email: String,             // Seller's email
  whatsAppNumber: String,    // WhatsApp number
  status: String,            // ACTIVE/INACTIVE/SUSPENDED
  specialization: Array,     // Service types they handle
  rating: Number,            // Average rating (0-5)
  totalOrders: Number,       // Total orders handled
  completedOrders: Number,   // Successfully completed orders
  responseTime: Number,      // Average response time (minutes)
  availability: String,      // AVAILABLE/BUSY/OFFLINE
  workingHours: Object,      // Start/end times
  commission: Number,        // Commission percentage
  lastActive: Date           // Last activity timestamp
}
```

### API Endpoints

#### WhatsApp Orders

- `POST /whatsapp-orders` - Create new order
- `GET /whatsapp-orders` - Get all orders with filters
- `GET /whatsapp-orders/:orderId` - Get specific order
- `PATCH /whatsapp-orders/:orderId/status` - Update order status
- `POST /whatsapp-orders/:orderId/forward` - Forward order to seller
- `POST /whatsapp-orders/:orderId/seller-response` - Handle seller response
- `DELETE /whatsapp-orders/:orderId` - Delete order

#### Sellers

- `POST /sellers` - Create new seller
- `GET /sellers` - Get all sellers with filters
- `GET /sellers/:sellerId` - Get specific seller
- `PATCH /sellers/:sellerId` - Update seller
- `PATCH /sellers/:phone/availability` - Update availability
- `DELETE /sellers/:sellerId` - Delete seller

#### Dashboard

- `GET /dashboard/overview` - Dashboard overview data
- `GET /dashboard/analytics` - Analytics data
- `GET /dashboard/orders` - Orders with advanced filtering
- `GET /dashboard/sellers` - Sellers with advanced filtering

#### Webhook

- `GET /whatsapp-webhook` - Webhook verification
- `POST /whatsapp-webhook` - Process incoming messages

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env` file with the following variables:

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
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

```bash
# Start MongoDB (if using local)
mongod

# Or use MongoDB Atlas cloud database
```

### 4. Start Server

```bash
npm run dev
```

### 5. WhatsApp Webhook Setup

1. Go to Meta Developer Console
2. Create a WhatsApp Business App
3. Configure webhook URL: `https://your-domain.com/whatsapp-webhook`
4. Set verify token in environment variables
5. Subscribe to messages webhook

## 📱 Usage Examples

### Customer Order Flow

1. **Customer sends WhatsApp message:**

   ```
   "Hi, I need NID service. My name is John Doe. NID: 1234567890"
   ```

2. **System automatically:**

   - Parses the message
   - Creates order in database
   - Sends confirmation to customer
   - Finds available seller
   - Forwards order to seller

3. **Seller receives notification:**

   ```
   🆕 New Order Received

   Order ID: ORD-1234567890-ABC123
   Customer: John Doe
   Service: NID_ORDER
   Price: ৳100

   Reply with:
   ✅ ACCEPT - to accept the order
   ❌ REJECT - to reject the order
   ```

4. **Seller responds:**

   ```
   "ACCEPT ORD-1234567890-ABC123"
   ```

5. **System automatically:**
   - Updates order status
   - Sends confirmation to seller
   - Notifies customer of acceptance

### Website Dashboard

- **Orders Management**: View, filter, and manage all orders
- **Seller Management**: Add, edit, and monitor sellers
- **Analytics**: View performance metrics and statistics
- **Real-time Updates**: Live status updates and notifications

## 🔒 Security Features

- **Webhook Verification**: Secure webhook signature verification
- **Input Validation**: Comprehensive input sanitization
- **Error Handling**: Graceful error handling and logging
- **Rate Limiting**: API rate limiting (implement as needed)
- **Authentication**: JWT-based authentication for admin access

## 📈 Monitoring & Analytics

### Key Metrics

- **Order Volume**: Total orders per day/week/month
- **Completion Rate**: Percentage of completed orders
- **Response Time**: Average seller response time
- **Revenue**: Total revenue and average order value
- **Seller Performance**: Individual seller statistics

### Dashboard Features

- **Real-time Statistics**: Live order and seller counts
- **Status Breakdown**: Visual representation of order statuses
- **Performance Charts**: Revenue and completion rate trends
- **Seller Rankings**: Top-performing sellers list

## 🚀 Deployment

### Production Setup

1. **Environment**: Set `NODE_ENV=production`
2. **Database**: Use MongoDB Atlas or production MongoDB
3. **SSL**: Configure HTTPS for webhook security
4. **Monitoring**: Set up logging and monitoring
5. **Backup**: Configure database backups

### Scaling Considerations

- **Load Balancing**: Use multiple server instances
- **Database**: Consider MongoDB sharding for large datasets
- **Caching**: Implement Redis for frequently accessed data
- **Queue System**: Use message queues for high-volume processing

## 🔧 Customization

### Adding New Order Types

1. Update `orderType` enum in models
2. Add parsing logic in `parseCustomerMessage()`
3. Update notification templates
4. Add pricing logic

### Custom Notification Templates

Modify `whatsappNotification.service.js` to customize message formats and add new notification types.

### Integration with External Services

The system is designed to be extensible. Add new services in the `services/` directory and integrate with external APIs as needed.

## 📞 Support

For technical support or questions about the system:

- Check the logs for error details
- Review the API documentation
- Test webhook endpoints
- Verify environment variables

## 🔄 Future Enhancements

- **AI/ML Integration**: Smart order routing and fraud detection
- **Multi-language Support**: Support for multiple languages
- **Payment Integration**: Direct payment processing
- **Advanced Analytics**: Predictive analytics and insights
- **Mobile App**: Native mobile applications
- **Voice Integration**: Voice message processing
- **Chatbot**: AI-powered customer support

---

**Built with ❤️ using Node.js, Express, MongoDB, and WhatsApp Business API**
