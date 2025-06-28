# Authentication API Documentation

This document describes the authentication system and protected routes in the digital-server1 application.

## Authentication Endpoints

### Base URL: `/auth`

#### 1. User Registration

- **POST** `/auth/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "number": "01912345678"
  }
  ```
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Signup successful",
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "john@example.com",
        "role": "user"
      }
    }
  }
  ```

#### 2. User Login

- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Login successful",
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "john@example.com",
        "role": "user"
      }
    }
  }
  ```

#### 3. Token Verification

- **POST** `/auth/verify`
- **Body:**
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Token is valid and user exists",
    "data": {
      "id": "user_id",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

#### 4. Logout

- **POST** `/auth/logout`
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Logout successful. Please remove the token from client storage."
  }
  ```

## Protected Routes

### Base URL: `/protected`

All protected routes require authentication via JWT token in the Authorization header.

**Header Required:**

```
Authorization: Bearer <jwt_token>
```

#### 1. Get User Profile

- **GET** `/protected/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Profile retrieved successfully",
    "data": {
      "id": "user_id",
      "email": "john@example.com",
      "role": "user",
      "message": "This is a protected route - you are authenticated!"
    }
  }
  ```

#### 2. Get Dashboard Data

- **GET** `/protected/dashboard`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Dashboard data retrieved successfully",
    "data": {
      "userEmail": "john@example.com",
      "dashboardItems": [
        "Welcome to your dashboard",
        "This is protected content",
        "Only authenticated users can see this"
      ],
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

#### 3. Update User Settings

- **PUT** `/protected/settings`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "John Updated",
    "number": "01987654321"
  }
  ```
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Settings updated successfully",
    "data": {
      "userId": "user_id",
      "userEmail": "john@example.com",
      "updatedFields": {
        "name": "John Updated",
        "number": "01987654321"
      },
      "message": "Settings would be updated in the database"
    }
  }
  ```

#### 4. Get User Orders

- **GET** `/protected/orders`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Orders retrieved successfully",
    "data": {
      "userEmail": "john@example.com",
      "orders": [
        {
          "id": "order1",
          "type": "NID Order",
          "status": "Completed",
          "date": "2024-01-15"
        },
        {
          "id": "order2",
          "type": "Birth Certificate",
          "status": "Pending",
          "date": "2024-01-20"
        }
      ]
    }
  }
  ```

## Error Responses

### Authentication Errors

```json
{
  "status": "Failed",
  "message": "Access denied. No token provided or invalid format"
}
```

```json
{
  "status": "Failed",
  "message": "Invalid token"
}
```

```json
{
  "status": "Failed",
  "message": "Token expired"
}
```

### General Errors

```json
{
  "status": "Failed",
  "message": "Error message here"
}
```

## Usage Examples

### JavaScript/Fetch Example

```javascript
// Login
const loginResponse = await fetch("/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john@example.com",
    password: "password123",
  }),
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// Access protected route
const profileResponse = await fetch("/protected/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const profileData = await profileResponse.json();
```

### cURL Example

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Access protected route
curl -X GET http://localhost:3000/protected/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Notes

1. **Token Storage:** Store JWT tokens securely on the client side (e.g., in memory, secure cookies, or encrypted local storage)
2. **Token Expiration:** Tokens expire after 7 days by default
3. **HTTPS:** Always use HTTPS in production to protect token transmission
4. **Token Validation:** The server validates tokens on every protected route request
5. **User Verification:** The server checks if the user still exists in the database on each request
