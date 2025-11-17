const express = require('express');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { validateProductQuery, validateCreateProduct, validateUpdateProduct } = require('../middlewares/validateProduct');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/', validateProductQuery, listProducts);
router.get('/:id', getProduct);
router.post('/', authMiddleware, roleMiddleware('admin'), validateCreateProduct, createProduct);
router.put('/:id', authMiddleware, roleMiddleware('admin'), validateUpdateProduct, updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteProduct);

module.exports = router;