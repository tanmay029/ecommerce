const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    if (!productId || !quantity || !size) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
router.put('/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
});

module.exports = router;