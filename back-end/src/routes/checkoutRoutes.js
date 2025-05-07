const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { validateCsrfToken } = require('../middleware/csrfMiddleware');
const { checkout } = require('../controllers/checkoutController');

router.post('/checkout', jwtMiddleware, validateCsrfToken, checkout);

module.exports = router;
