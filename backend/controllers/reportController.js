const reportService = require('../services/reportService');

const getDailyRevenue = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const rows = await reportService.getDailyRevenue(days);
    res.json({ rows });
  } catch (error) {
    console.error('Error getting daily revenue:', error);
    res.status(500).json({ error: 'Failed to get daily revenue' });
  }
};

const getTopCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const rows = await reportService.getTopCustomers(limit);
    res.json({ rows });
  } catch (error) {
    console.error('Error getting top customers:', error);
    res.status(500).json({ error: 'Failed to get top customers' });
  }
};

const getCategorySummary = async (req, res) => {
  try {
    const rows = await reportService.getCategorySummary();
    res.json({ rows });
  } catch (error) {
    console.error('Error getting category summary:', error);
    res.status(500).json({ error: 'Failed to get category summary' });
  }
};

module.exports = {
  getDailyRevenue,
  getTopCustomers,
  getCategorySummary
};