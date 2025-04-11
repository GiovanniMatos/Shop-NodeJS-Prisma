const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/products', shopController.getAllProducts);

module.exports = router;
