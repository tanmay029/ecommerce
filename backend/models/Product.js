const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['men', 'women', 'kids'],
  },
  subcategory: {
    type: String,
    required: [true, 'Product subcategory is required'],
  },
  sizes: [{
    type: String,
  }],
  colors: [{
    type: String,
  }],
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);