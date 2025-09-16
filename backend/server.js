const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://ecommerce-liard-eight-38.vercel.app/',
    'ecommerce-production-4053.up.railway.app',
    /\.vercel\.app$/,
    /\.railway\.app$/
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Credentials'
  ]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 👇 PRODUCTS DATA - MUST BE HERE BEFORE ROUTES
const mockProducts = [
  {
    _id: '1',
    name: 'Classic White T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    description: 'A timeless wardrobe essential crafted from 100% organic cotton. This premium t-shirt features a comfortable regular fit, reinforced seams for durability, and pre-shrunk fabric to maintain its shape wash after wash. Perfect for layering or wearing solo, this versatile piece offers breathable comfort and effortless style for any casual occasion.',
    category: 'men',
    subcategory: 'Casual Wear',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Gray', 'Navy'],
    stock: 50,
    featured: true,
    brand: 'FashionStore',
    rating: 4.5,
    numReviews: 128,
  },
  {
    _id: '2',
    name: 'Premium Denim Jeans',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    description: 'Expertly crafted from premium Japanese selvedge denim, these jeans offer the perfect blend of style and comfort. Featuring a modern slim-fit silhouette, five-pocket design, and subtle fading details. The high-quality construction ensures these jeans will age beautifully while maintaining their shape.',
    category: 'men',
    subcategory: 'Bottoms',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Classic Blue', 'Dark Indigo', 'Black', 'Stone Wash'],
    stock: 30,
    featured: true,
    brand: 'DenimCo',
    rating: 4.7,
    numReviews: 89,
  },
  {
    _id: '3',
    name: 'Professional Business Blazer',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    description: 'Elevate your professional wardrobe with this sophisticated blazer. Tailored from a premium wool-blend fabric, it features a contemporary fit, notched lapels, and functional sleeve buttons. Perfect for business meetings and formal events.',
    category: 'men',
    subcategory: 'Formal Wear',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal Gray', 'Navy Blue', 'Black', 'Dark Brown'],
    stock: 15,
    featured: true,
    brand: 'BusinessPro',
    rating: 4.4,
    numReviews: 92,
  },
  {
    _id: '4',
    name: 'Athletic Performance Polo',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop',
    description: 'Stay comfortable and look sharp with this moisture-wicking performance polo. Made from technical fabric that keeps you cool and dry, featuring UV protection and anti-odor technology.',
    category: 'men',
    subcategory: 'Activewear',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'White', 'Royal Blue', 'Forest Green', 'Burgundy'],
    stock: 45,
    featured: false,
    brand: 'ActiveFit',
    rating: 4.3,
    numReviews: 156,
  },
  {
    _id: '5',
    name: 'Leather Dress Shoes',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&h=500&fit=crop',
    description: 'Handcrafted from genuine full-grain leather, these Oxford dress shoes epitomize elegance. Featuring a classic cap-toe design, leather sole with rubber heel, and cushioned insole for all-day comfort.',
    category: 'men',
    subcategory: 'Footwear',
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    colors: ['Black', 'Brown', 'Cognac'],
    stock: 25,
    featured: true,
    brand: 'ClassicStyle',
    rating: 4.6,
    numReviews: 203,
  },
  {
    _id: '6',
    name: 'Casual Chino Shorts',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1506629905607-0b836b2ac701?w=500&h=500&fit=crop',
    description: 'Perfect for warm weather, these versatile chino shorts combine comfort with style. Made from lightweight cotton twill with a hint of stretch for mobility.',
    category: 'men',
    subcategory: 'Shorts',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Khaki', 'Navy', 'Olive', 'Stone', 'Charcoal'],
    stock: 60,
    featured: false,
    brand: 'SummerVibes',
    rating: 4.2,
    numReviews: 124,
  },
  {
    _id: '7',
    name: 'Elegant Summer Dress',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=500&fit=crop',
    description: 'This enchanting midi dress captures the essence of effortless femininity. Crafted from flowing chiffon with a delicate floral print, featuring a flattering A-line silhouette and feminine V-neckline.',
    category: 'women',
    subcategory: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Blue', 'Rose Pink', 'Sage Green', 'Lavender'],
    stock: 25,
    featured: true,
    brand: 'FloralElegance',
    rating: 4.8,
    numReviews: 156,
  },
  {
    _id: '8',
    name: 'Cozy Cashmere Sweater',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
    description: 'Indulge in luxury with this ultra-soft cashmere blend sweater. The relaxed fit and crew neck design offer timeless appeal, while the premium cashmere provides unmatched warmth and softness.',
    category: 'women',
    subcategory: 'Knitwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Soft Pink', 'Light Gray', 'Camel', 'Navy'],
    stock: 35,
    featured: true,
    brand: 'LuxeKnits',
    rating: 4.9,
    numReviews: 174,
  },
  {
    _id: '9',
    name: 'High-Waisted Skinny Jeans',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop',
    description: 'Designed to flatter every figure, these high-waisted skinny jeans offer the perfect combination of style and comfort. Made from premium stretch denim that moves with you while maintaining its shape.',
    category: 'women',
    subcategory: 'Bottoms',
    sizes: ['24', '25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Dark Wash', 'Medium Blue', 'Black', 'Light Wash'],
    stock: 40,
    featured: false,
    brand: 'PerfectFit',
    rating: 4.5,
    numReviews: 287,
  },
  {
    _id: '10',
    name: 'Silk Blouse',
    price: 65.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop',
    description: 'Elevate your wardrobe with this luxurious silk blouse. The fluid drape and lustrous finish create an elegant silhouette that transitions seamlessly from office to evening.',
    category: 'women',
    subcategory: 'Tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivory', 'Blush Pink', 'Emerald', 'Navy', 'Champagne'],
    stock: 28,
    featured: true,
    brand: 'SilkLux',
    rating: 4.7,
    numReviews: 112,
  },
  {
    _id: '11',
    name: 'Designer High Heels',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
    description: 'Step into sophistication with these stunning pointed-toe heels. Crafted from supple leather with a sleek 4-inch stiletto heel, featuring cushioned insoles and arch support.',
    category: 'women',
    subcategory: 'Footwear',
    sizes: ['5', '6', '7', '8', '9', '10', '11'],
    colors: ['Black Patent', 'Nude', 'Red', 'Navy', 'Metallic Gold'],
    stock: 22,
    featured: true,
    brand: 'ElegantSteps',
    rating: 4.3,
    numReviews: 145,
  },
  {
    _id: '12',
    name: 'Yoga Leggings',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1506629905607-0b836b2ac701?w=500&h=500&fit=crop',
    description: 'Designed for movement and comfort, these high-performance yoga leggings are crafted from moisture-wicking fabric with four-way stretch. Perfect for yoga, pilates, or any active lifestyle.',
    category: 'women',
    subcategory: 'Activewear',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Charcoal', 'Navy', 'Deep Purple', 'Forest Green'],
    stock: 55,
    featured: false,
    brand: 'ActiveFlow',
    rating: 4.6,
    numReviews: 298,
  },
  {
    _id: '13',
    name: 'Kids Rainbow T-Shirt',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=500&fit=crop',
    description: 'Brighten up your child\'s wardrobe with this cheerful rainbow t-shirt. Made from soft, breathable cotton that\'s gentle on sensitive skin, featuring a vibrant rainbow graphic that won\'t fade.',
    category: 'kids',
    subcategory: 'Casual Wear',
    sizes: ['2T', '3T', '4T', '5T', '6T', '7', '8'],
    colors: ['Rainbow Print', 'Pastel Rainbow', 'Bright Rainbow'],
    stock: 40,
    featured: true,
    brand: 'KidsJoy',
    rating: 4.9,
    numReviews: 67,
  },
  {
    _id: '14',
    name: 'Denim Overalls',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&h=500&fit=crop',
    description: 'Classic and comfortable, these adorable denim overalls are perfect for active kids. Made from durable cotton denim with adjustable shoulder straps and multiple pockets.',
    category: 'kids',
    subcategory: 'Bottoms',
    sizes: ['12M', '18M', '2T', '3T', '4T', '5T'],
    colors: ['Classic Blue', 'Light Wash', 'Dark Denim'],
    stock: 30,
    featured: true,
    brand: 'LittleExplorers',
    rating: 4.7,
    numReviews: 85,
  },
  {
    _id: '15',
    name: 'Princess Dress',
    price: 42.99,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=500&fit=crop',
    description: 'Let your little princess shine in this enchanting dress. Crafted from soft tulle and satin with delicate embroidered details, featuring a fitted bodice and full skirt perfect for twirling.',
    category: 'kids',
    subcategory: 'Dresses',
    sizes: ['2T', '3T', '4T', '5T', '6', '7', '8'],
    colors: ['Pink', 'Purple', 'Blue', 'White'],
    stock: 25,
    featured: false,
    brand: 'PrincessDreams',
    rating: 4.8,
    numReviews: 134,
  },
  {
    _id: '16',
    name: 'Kids Sneakers',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop',
    description: 'Keep little feet comfortable with these high-quality kids\' sneakers. Features flexible rubber sole, breathable mesh upper, and easy-on velcro straps for independent dressing.',
    category: 'kids',
    subcategory: 'Footwear',
    sizes: ['5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C', '1Y', '2Y', '3Y'],
    colors: ['Blue/White', 'Pink/Purple', 'Black/Red', 'Gray/Green'],
    stock: 50,
    featured: true,
    brand: 'ActiveKids',
    rating: 4.5,
    numReviews: 176,
  },
  {
    _id: '17',
    name: 'Cozy Pajama Set',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
    description: 'Ensure sweet dreams with this incredibly soft pajama set. Made from organic cotton that gets softer with each wash, featuring fun printed patterns that kids love.',
    category: 'kids',
    subcategory: 'Sleepwear',
    sizes: ['2T', '3T', '4T', '5T', '6', '7', '8', '10'],
    colors: ['Dinosaur Print', 'Unicorn Print', 'Space Theme', 'Animal Friends'],
    stock: 45,
    featured: false,
    brand: 'SweetDreams',
    rating: 4.6,
    numReviews: 92,
  },
  {
    _id: '18',
    name: 'Leather Crossbody Bag',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    description: 'This versatile crossbody bag combines style and functionality. Crafted from genuine leather with multiple compartments and adjustable strap for customizable wear.',
    category: 'women',
    subcategory: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Cognac', 'Navy'],
    stock: 20,
    featured: true,
    brand: 'LeatherCraft',
    rating: 4.7,
    numReviews: 88,
  },
  {
    _id: '19',
    name: 'Wool Winter Coat',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5c2b1bb04?w=500&h=500&fit=crop',
    description: 'Stay warm and stylish with this sophisticated wool coat. Features double-breasted design, wide lapels, and belted waist for a flattering silhouette.',
    category: 'women',
    subcategory: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Black', 'Navy', 'Gray'],
    stock: 15,
    featured: true,
    brand: 'WinterLux',
    rating: 4.8,
    numReviews: 124,
  },
  {
    _id: '20',
    name: 'Athletic Running Shoes',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
    description: 'Engineered for performance, these running shoes feature advanced cushioning technology and breathable mesh construction. Perfect for serious runners and fitness enthusiasts.',
    category: 'men',
    subcategory: 'Athletic Footwear',
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    colors: ['White/Blue', 'Black/Red', 'Gray/Orange', 'Navy/Green'],
    stock: 35,
    featured: true,
    brand: 'RunTech',
    rating: 4.4,
    numReviews: 267,
  }
];

console.log(`🚀 Server starting with ${mockProducts.length} products loaded`);

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('📊 Health check requested');
  res.json({
    success: true,
    message: 'Backend server is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    productsCount: mockProducts.length
  });
});

// ✅ FIXED: Products list endpoint - consistent format
app.get('/api/products', (req, res) => {
  try {
    console.log('📋 GET /api/products - Query params:', req.query);
    
    let filteredProducts = [...mockProducts];

    // Apply filters
    if (req.query.keyword) {
      const keyword = req.query.keyword.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    }

    if (req.query.category && req.query.category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }

    if (req.query.featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    console.log(`✅ Returning ${filteredProducts.length} products`);

    // ✅ FIXED: Consistent response format
    res.json({
      success: true,
      products: filteredProducts,
      totalProducts: filteredProducts.length,
      page: 1,
      pages: 1
    });

  } catch (error) {
    console.error('❌ Error in GET /api/products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message
    });
  }
});

// ✅ FIXED: Single product endpoint
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = req.params.id;
    console.log('🔍 GET /api/products/:id - Looking for product ID:', productId);
    
    const product = mockProducts.find(p => p._id === productId);
    
    if (!product) {
      console.log('❌ Product not found:', productId);
      return res.status(404).json({
        success: false,
        message: `Product with ID "${productId}" not found`
      });
    }

    console.log('✅ Found product:', product.name);

    // ✅ THE FIX: Use "data" not "product"
    res.json({
      success: true,
       product    // ← This is the key change
    });

  } catch (error) {
    console.error('❌ Error in GET /api/products/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: error.message
    });
  }
});


// ✅ FIXED: Auth endpoints - consistent format
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('🔐 POST /api/auth/login - Email:', req.body.email);
    
    const { email, password } = req.body;

    if (email === 'admin@example.com' && password === 'admin123') {
      const user = {
        _id: 'admin-123',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        token: 'mock-jwt-token-' + Date.now()
      };
      res.json({ success: true,  user });
    } else if (email === 'john@example.com' && password === 'john123') {
      const user = {
        _id: 'user-456',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        token: 'mock-jwt-token-' + Date.now()
      };
      res.json({ success: true,  user });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

  } catch (error) {
    console.error('❌ Error in POST /api/auth/login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = {
      _id: 'user-' + Date.now(),
      name,
      email: email.toLowerCase(),
      role: 'user',
      token: 'mock-jwt-token-' + Date.now()
    };
    res.status(201).json({ success: true,  newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// ✅ FIXED: Orders endpoints - consistent format
app.post('/api/orders', (req, res) => {
  try {
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder = {
      _id: 'order-' + Date.now(),
      orderId,
      ...req.body,
      isPaid: true,
      isDelivered: false,
      createdAt: new Date().toISOString(),
    };
    res.status(201).json({ success: true,  newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = {
      _id: req.params.id,
      orderId: 'ORD-DEMO123',
      user: { name: 'John Doe', email: 'john@example.com' },
      orderItems: [
        {
          name: 'Classic T-Shirt',
          qty: 2,
          image: mockProducts[0].image,
          price: 29.99,
          size: 'M',
          product: '1'
        }
      ],
      shippingAddress: {
        address: '123 Demo St',
        city: 'Demo City',
        postalCode: '12345',
        country: 'United States'
      },
      paymentMethod: 'Razorpay',
      itemsPrice: 59.98,
      taxPrice: 5.99,
      shippingPrice: 0,
      totalPrice: 65.97,
      isPaid: true,
      isDelivered: false,
      createdAt: new Date().toISOString()
    };
    res.json({ success: true,  order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Order fetch failed' });
  }
});

app.get('/api/orders/admin', (req, res) => {
  try {
    const orders = [
      {
        _id: 'order-1',
        orderId: 'ORD-ABC123',
        user: { name: 'John Doe' },
        orderItems: [{ name: 'T-Shirt' }],
        totalPrice: 29.99,
        isPaid: true,
        isDelivered: false,
        createdAt: new Date().toISOString()
      }
    ];
    res.json({ success: true,  orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Admin orders fetch failed' });
  }
});

// Catch all
app.use('*', (req, res) => {
  console.log('❓ Unknown route:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Backend server is running!');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`📊 Products loaded: ${mockProducts.length}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
