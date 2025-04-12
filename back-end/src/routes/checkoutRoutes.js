const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { verifyCsrfToken } = require('../middleware/csrfMiddleware');
const { handleCheckout } = require('../controllers/checkoutController');

router.post('/checkout', jwtMiddleware, verifyCsrfToken, handleCheckout);

module.exports = router;
