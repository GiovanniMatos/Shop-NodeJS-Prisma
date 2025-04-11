const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { verifyCsrfToken } = require('../middleware/csrfMiddleware'); 
const { getCart, addToCart, removeFromCart, updateCart } = require('../controllers/cartController');

router.get('/cart', jwtMiddleware, getCart);
router.post('/cart/add', jwtMiddleware, verifyCsrfToken, addToCart);
router.post('/cart/remove', jwtMiddleware, verifyCsrfToken, removeFromCart);
router.post('/cart/update', jwtMiddleware, verifyCsrfToken, updateCart);

module.exports = router;