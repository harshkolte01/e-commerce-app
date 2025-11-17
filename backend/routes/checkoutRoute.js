const express = require('express');
const { createOrder } = require('../controllers/checkoutController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateCheckoutPayload } = require('../middlewares/validateCheckout');

const router = express.Router();

router.post('/', authMiddleware, validateCheckoutPayload, createOrder);

module.exports = router;