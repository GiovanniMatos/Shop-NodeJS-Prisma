const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { validateCsrfToken } = require('../middleware/csrfMiddleware'); 
const { getCart, addToCart, removeFromCart, updateCart } = require('../controllers/cartController');

router.get('/cart', jwtMiddleware, getCart);
router.post('/cart/add', jwtMiddleware, validateCsrfToken, addToCart);
router.post('/cart/remove', jwtMiddleware, validateCsrfToken, removeFromCart);
router.post('/cart/update', jwtMiddleware, validateCsrfToken, updateCart);

module.exports = router;