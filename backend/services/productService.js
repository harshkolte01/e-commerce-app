const Product = require('../models/product.model');
const mongoose = require('mongoose');

const list = async (filter, options) => {
  const query = {};
  
  if (filter.q) {
    query.name = { $regex: filter.q, $options: 'i' };
  }
  
  if (filter.category) {
    query.category = filter.category;
  }
  
  if (filter.minPrice || filter.maxPrice) {
    query.price = {};
    if (filter.minPrice) query.price.$gte = filter.minPrice;
    if (filter.maxPrice) query.price.$lte = filter.maxPrice;
  }
  
  if (filter.inStock !== undefined) {
    query.stock = filter.inStock ? { $gt: 0 } : 0;
  }

  const allowedSortFields = ['price', 'name', 'updatedAt'];
  let sortObj = { price: -1 };
  
  if (options.sort) {
    const sortField = options.sort.startsWith('-') ? options.sort.slice(1) : options.sort;
    const sortDirection = options.sort.startsWith('-') ? -1 : 1;
    
    if (allowedSortFields.includes(sortField)) {
      sortObj = { [sortField]: sortDirection };
    }
  }

  const skip = (options.page - 1) * options.limit;

  const [items, total] = await Promise.all([
    Product.find(query).sort(sortObj).skip(skip).limit(options.limit).lean(),
    Product.countDocuments(query)
  ]);

  return { items, total };
};

const getById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Product.findById(id);
  }
  
  return await Product.findOne({ sku: id });
};

module.exports = {
  list,
  getById
};