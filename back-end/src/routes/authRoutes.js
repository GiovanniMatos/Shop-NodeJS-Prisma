const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/testebackend', (req, res) => {
  res.send('Backend is working!');
});

module.exports = router;