const express = require('express');
const { listOrders, getOrderById } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, listOrders);
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;