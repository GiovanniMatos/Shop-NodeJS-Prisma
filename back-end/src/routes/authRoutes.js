const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { loginLimiter, validateLogin, validateRegister} = require('../middleware/loginGuard');

router.post('/register', validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.get('/testebackend', (req, res) => {
  res.send('Backend is working!');
});

module.exports = router;