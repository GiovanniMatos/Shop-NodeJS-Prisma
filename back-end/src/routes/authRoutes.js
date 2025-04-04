const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/testebackend', (req, res) => {
  res.send('Backend is working!');
});

module.exports = router;