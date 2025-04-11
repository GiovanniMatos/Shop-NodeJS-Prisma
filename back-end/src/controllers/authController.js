const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // 🔥 Pra gerar o csrf token

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res.status(201).json({ message: 'Usuário criado', userId: user.id, userName: user.username });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Username ou email já cadastrado' });
    }
    console.error("Erro no prisma:", err);
    res.status(400).json({ error: 'Não foi possível cadastrar' });
  } finally {
    await prisma.$disconnect();
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hora
      });
      
      const csrfToken = crypto.randomBytes(32).toString('hex');
      res.cookie('csrfToken', csrfToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });

      return res.json({ username: user.username });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.clearCookie('csrfToken');
  return res.status(200).json({ message: 'Logout bem-sucedido' });
};

module.exports = { register, login, logout };
