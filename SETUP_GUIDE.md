# Complete Setup Guide - Fashion E-commerce

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Modern web browser

## Step-by-Step Setup

### 1. MongoDB Setup

#### Option A: Local MongoDB
```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community

# Ubuntu
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Recommended)
1. Visit https://mongodb.com/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update backend/.env with your connection string

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_SECRET=your_razorpay_secret_key
EOF

# Start the server
npm start
```

### 3. Frontend Setup
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

### 4. Verification
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000
- Should see "Server is running successfully!" message

## Demo Credentials
- **Admin:** admin@example.com / admin123
- **User:** john@example.com / john123

## Troubleshooting

### MongoDB Issues
```bash
# Check if MongoDB is running
brew services list | grep mongodb  # macOS
systemctl status mongodb           # Ubuntu

# Start MongoDB
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongodb                        # Ubuntu
```

### Dependency Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Port Issues
```bash
# Kill processes on ports 3000 and 5000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
```

## Payment Testing
Use these test credentials with Razorpay:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Features Overview
- 🏠 Home page with hero section
- 📦 Product listings with filters
- 🛒 Shopping cart functionality
- 💳 Secure checkout with Razorpay
- 👤 User authentication
- 🔧 Admin dashboard
- 📱 Mobile responsive design

All components are production-ready!
