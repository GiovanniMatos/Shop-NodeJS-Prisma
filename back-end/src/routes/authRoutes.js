const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { loginLimiter, validateLogin, validateRegister } = require('../middleware/loginGuard');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.post('/register', validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);

// Rota de Logout
router.post('/logout', logout);

// Rota para pegar o Token CSRF Lendo diretamente do JWT
router.get('/csrf-token', jwtMiddleware, (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(403).json({ error: 'Usuário não autenticado' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return res.json({ csrfToken: decoded.csrfToken });
  } catch (err) {
    return res.status(403).json({ error: 'JWT inválido' });
  }
});

// Teste do Back-end
router.get('/testebackend', (req, res) => {
  res.send('Backend is working!');
});

module.exports = router;
