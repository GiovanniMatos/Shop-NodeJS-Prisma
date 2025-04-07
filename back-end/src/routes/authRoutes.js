const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { loginLimiter, validateLogin, validateRegister } = require('../middleware/loginGuard');
const { generateCsrfToken} = require('../middleware/csrfMiddleware');
const jwtMiddleware = require('../middleware/jwtMiddleware')

router.post('/register', validateRegister, register); 
router.post('/login', loginLimiter, validateLogin, login);
router.post('/logout', logout);
router.get('/csrf-token', jwtMiddleware, generateCsrfToken, (req, res) => {
  res.json({ csrfToken: req.csrfToken });
});
router.get('/testebackend', (req, res) => {
    res.send('Backend is working!');
});

module.exports = router;