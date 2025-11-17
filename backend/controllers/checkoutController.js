const checkoutService = require('../services/checkoutService');

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    const order = await checkoutService.createOrder(userId, items);

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error.message.includes('not found') || error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};

module.exports = {
  createOrder
};