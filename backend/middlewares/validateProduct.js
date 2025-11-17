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

module.exports = {
  validateProductQuery
};