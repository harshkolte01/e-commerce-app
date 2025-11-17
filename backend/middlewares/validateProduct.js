const validateProductQuery = (req, res, next) => {
  const { page = 1, limit = 10, sort = '-price', minPrice, maxPrice, inStock } = req.query;

  req.query.page = Math.max(1, parseInt(page) || 1);
  req.query.limit = Math.max(1, Math.min(50, parseInt(limit) || 10));

  const allowedSortFields = ['price', 'name', 'updatedAt', '-price', '-name', '-updatedAt'];
  req.query.sort = allowedSortFields.includes(sort) ? sort : '-price';

  if (minPrice) {
    const min = parseFloat(minPrice);
    req.query.minPrice = isNaN(min) ? undefined : min;
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    req.query.maxPrice = isNaN(max) ? undefined : max;
  }

  if (inStock !== undefined) {
    req.query.inStock = inStock === 'true';
  }

  next();
};

const validateCreateProduct = (req, res, next) => {
  const { sku, name, price } = req.body;

  if (!sku || !name || !price) {
    return res.status(400).json({ error: 'SKU, name, and price are required' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  next();
};

const validateUpdateProduct = (req, res, next) => {
  const { price } = req.body;

  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  next();
};

module.exports = {
  validateProductQuery,
  validateCreateProduct,
  validateUpdateProduct
};