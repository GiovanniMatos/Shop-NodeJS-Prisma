const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const registerPage = (req, res) => {
  res.render('auth/register'); 
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashedPassword },
  });
  res.redirect('/login');
};

const loginPage = (req, res) => {
  res.render('auth/login'); 
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' });

        // Você pode armazenar o token em um cookie, no localStorage ou enviá-lo como resposta JSON
        res.cookie('token', token, { httpOnly: true }); // Armazena o token em um cookie HTTP-only - anti-xss
        // ou res.json({token: token})
        res.redirect('/cart');
    } else {
        res.redirect('/login');
    }
};

module.exports = { registerPage, register, loginPage, login };