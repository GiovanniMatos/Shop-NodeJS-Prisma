const express = require('express');
const router = express.Router();
const { getShop } = require('../controllers/shopController');

router.get('/products', getShop); // /api/products via NGINX

module.exports = router;