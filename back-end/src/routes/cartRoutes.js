const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { verifyCsrfToken } = require('../middleware/csrfMiddleware'); 
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/cart', jwtMiddleware, getCart);
router.post('/cart/add', jwtMiddleware, verifyCsrfToken, addToCart);
router.post('/cart/remove', jwtMiddleware, verifyCsrfToken, removeFromCart); 

module.exports = router;