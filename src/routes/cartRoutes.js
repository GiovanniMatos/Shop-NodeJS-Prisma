const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/cart', jwtMiddleware, getCart);
router.post('/cart/add', jwtMiddleware, addToCart);
router.post('/cart/remove', jwtMiddleware, removeFromCart);

module.exports = router;