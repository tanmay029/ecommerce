const Product = require('./models/Product');
const User = require('./models/User');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    isAdmin: false,
  },
];

const products = [
  {
    name: "Men's Classic White Shirt",
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop',
    description: 'Comfortable and stylish white shirt perfect for office wear. Made from premium cotton blend.',
    category: 'men',
    subcategory: "Men's Shirts",
    price: 29.99,
    stock: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue'],
    featured: true,
  },
  {
    name: "Men's Casual Blue Jeans",
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    description: 'Comfortable denim jeans for casual wear. Regular fit with classic styling.',
    category: 'men',
    subcategory: "Men's Jeans",
    price: 49.99,
    stock: 20,
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black'],
    featured: false,
  },
  {
    name: "Women's Elegant Black Dress",
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=500&fit=crop',
    description: 'Beautiful black dress perfect for special occasions. Elegant design with premium fabric.',
    category: 'women',
    subcategory: "Women's Dresses",
    price: 79.99,
    stock: 10,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Navy'],
    featured: true,
  },
  {
    name: "Women's Floral Summer Dress",
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
    description: 'Light and breezy floral dress perfect for summer occasions. Comfortable and stylish.',
    category: 'women',
    subcategory: "Women's Dresses",
    price: 59.99,
    stock: 12,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Yellow', 'White'],
    featured: false,
  },
  {
    name: "Kids' Colorful T-Shirt",
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=500&fit=crop',
    description: 'Fun and colorful t-shirt for kids. Soft cotton material, perfect for play and comfort.',
    category: 'kids',
    subcategory: "Kids' T-Shirts",
    price: 19.99,
    stock: 25,
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Red', 'Blue', 'Green'],
    featured: true,
  },
  {
    name: "Kids' Denim Overalls",
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&h=500&fit=crop',
    description: 'Cute denim overalls for little ones. Durable and comfortable for active kids.',
    category: 'kids',
    subcategory: "Kids' Overalls",
    price: 34.99,
    stock: 18,
    sizes: ['2T', '3T', '4T', '5T', '6T'],
    colors: ['Blue', 'Light Blue'],
    featured: false,
  },
  {
    name: "Men's Sports Jacket",
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',
    description: 'Lightweight sports jacket perfect for workouts and casual wear.',
    category: 'men',
    subcategory: "Men's Jackets",
    price: 89.99,
    stock: 8,
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Gray'],
    featured: false,
  },
  {
    name: "Women's Casual Blouse",
    image: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=500&fit=crop',
    description: 'Elegant casual blouse perfect for office or weekend wear.',
    category: 'women',
    subcategory: "Women's Tops",
    price: 39.99,
    stock: 14,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Pink', 'Light Blue'],
    featured: false,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    console.log('✅ Database seeded successfully!');
    console.log('🔐 Demo credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User: john@example.com / john123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Only run seeding if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  seedDatabase();
}

module.exports = seedDatabase;