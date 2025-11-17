const express = require('express');
const { list, detail } = require('../controllers/productController');
const { validateProductQuery } = require('../middlewares/validateProduct');

const router = express.Router();

router.get('/', validateProductQuery, list);
router.get('/:id', detail);

module.exports = router;