const express = require('express');
const { getDailyRevenue, getTopCustomers, getCategorySummary } = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// All report routes require admin access
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// SQL-based reports
router.get('/sql/daily-revenue', getDailyRevenue);
router.get('/sql/top-customers', getTopCustomers);

// MongoDB-based reports
router.get('/mongo/category-summary', getCategorySummary);

module.exports = router;