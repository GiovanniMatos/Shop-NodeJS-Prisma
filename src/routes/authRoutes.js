const express = require('express');
const router = express.Router();
const { registerPage, register, loginPage, login } = require('../controllers/authController');

router.get('/register', registerPage);
router.post('/register', register);
router.get('/login', loginPage);
router.post('/login', login);

module.exports = router;