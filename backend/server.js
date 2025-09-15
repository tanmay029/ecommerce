const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Basic health check route (before other routes)
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running successfully!', 
    timestamp: new Date(),
    status: 'OK' 
  });
});

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Seed dummy data after successful connection
    setTimeout(() => {
      try {
        require('./seedData');
      } catch (error) {
        console.log('Seeding will happen after first request');
      }
    }, 2000);

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Make sure MongoDB is running on your system');
    console.log('📖 See SETUP_GUIDE.md for MongoDB installation instructions');
  }
};

// Connect to database
connectDB();

// Import routes after DB connection
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
  console.log('📱 Start frontend: cd frontend && npm start');
  console.log('🚀 ================================');
});