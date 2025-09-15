const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const price = req.query.maxPrice
      ? { price: { $lte: Number(req.query.maxPrice) } }
      : {};

    const query = { ...keyword, ...category, ...price };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ 
      products, 
      page, 
      pages: Math.ceil(count / pageSize),
      total: count 
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured/top
router.get('/featured/top', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);
    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Error fetching featured products' });
  }
});

// @desc    Create a product
// @route   POST /api/products
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample Product',
      price: 0,
      image: 'https://via.placeholder.com/300',
      category: 'men',
      subcategory: 'Sample Category',
      stock: 0,
      description: 'Sample description',
      sizes: ['M'],
      colors: ['Black'],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, category, subcategory, stock, sizes, colors } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.subcategory = subcategory || product.subcategory;
      product.stock = stock !== undefined ? stock : product.stock;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;