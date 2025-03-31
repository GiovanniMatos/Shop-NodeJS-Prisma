const express = require('express');
const router = express.Router();
const { getShop } = require('../controllers/shopController');

router.get('/', getShop);

module.exports = router;