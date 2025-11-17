const validateCheckoutPayload = (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  if (items.length === 0) {
    return res.status(400).json({ error: 'Items array cannot be empty' });
  }

  if (items.length > 50) {
    return res.status(400).json({ error: 'Too many items in cart' });
  }

  for (const item of items) {
    if (!item.productId || typeof item.productId !== 'string') {
      return res.status(400).json({ error: 'Each item must have a valid productId' });
    }

    if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return res.status(400).json({ error: 'Each item must have a valid quantity >= 1' });
    }
  }

  next();
};

module.exports = {
  validateCheckoutPayload
};