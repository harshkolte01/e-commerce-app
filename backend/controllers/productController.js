const productService = require('../services/productService');

const list = async (req, res) => {
  try {
    const { page, limit, sort, category, minPrice, maxPrice, q, inStock } = req.query;

    const filter = { q, category, minPrice, maxPrice, inStock };
    const options = { page, limit, sort };

    const { items, total } = await productService.list(filter, options);

    res.json({
      items,
      total,
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const detail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productService.getById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

module.exports = {
  list,
  detail
};