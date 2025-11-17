const orderService = require('../services/orderService');

const listOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 12, fromDate, toDate } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 12));

    if (fromDate && isNaN(Date.parse(fromDate))) {
      return res.status(400).json({ error: 'Invalid fromDate format' });
    }

    if (toDate && isNaN(Date.parse(toDate))) {
      return res.status(400).json({ error: 'Invalid toDate format' });
    }

    const { items, total } = await orderService.listOrdersForUser(userId, {
      page: pageNum,
      limit: limitNum,
      fromDate,
      toDate
    });

    res.json({
      items,
      total,
      page: pageNum,
      limit: limitNum
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

module.exports = {
  listOrders,
  getOrderById
};