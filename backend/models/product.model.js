const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    index: true
  },
  stock: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

productSchema.index({ sku: 1, category: 1, updatedAt: 1 });

module.exports = mongoose.model('Product', productSchema);