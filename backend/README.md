# E-commerce Backend

Node.js/Express backend for the fashion e-commerce website.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Create .env file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_SECRET=your_razorpay_secret_key
```

3. **Start the server:**
```bash
npm run dev
# or
npm start
```

## Features

- RESTful API with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Razorpay Payment Integration (Demo Mode)
- Admin Panel Support
- Comprehensive Error Handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/top` - Get featured products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/myorders` - Get user orders
- `GET /api/orders` - Get all orders (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify-payment` - Verify payment

## Demo Credentials

- **Admin:** admin@example.com / admin123
- **User:** john@example.com / john123

## Health Check

Visit `http://localhost:5000/api/health` to verify the server is running.
