const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { verifyCsrfToken } = require('../middleware/csrfMiddleware');
const { checkout } = require('../controllers/checkoutController');

router.post('/checkout', jwtMiddleware, verifyCsrfToken, checkout);

module.exports = router;
