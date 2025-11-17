const Product = require('../models/product.model');
const mongoose = require('mongoose');

const findProducts = async ({ filter, sort, page, limit }) => {
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
  
  if (sort) {
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortDirection = sort.startsWith('-') ? -1 : 1;
    
    if (allowedSortFields.includes(sortField)) {
      sortObj = { [sortField]: sortDirection };
    }
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
    Product.countDocuments(query)
  ]);

  return { items, total };
};

const findProductById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Product.findById(id);
  }
  
  return await Product.findOne({ sku: id });
};

const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

const updateProduct = async (id, data) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }
  
  return await Product.findOneAndUpdate({ sku: id }, data, { new: true });
};

const deleteProduct = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Product.findByIdAndDelete(id);
  }
  
  return await Product.findOneAndDelete({ sku: id });
};

const findByIds = async (ids) => {
  return await Product.find({
    $or: [
      { _id: { $in: ids.filter(id => mongoose.Types.ObjectId.isValid(id)) } },
      { sku: { $in: ids } }
    ]
  });
};

const decrementStock = async (productId, quantity) => {
  if (mongoose.Types.ObjectId.isValid(productId)) {
    return await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { new: true }
    );
  }
  
  return await Product.findOneAndUpdate(
    { sku: productId },
    { $inc: { stock: -quantity } },
    { new: true }
  );
};

module.exports = {
  findProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  findByIds,
  decrementStock
};