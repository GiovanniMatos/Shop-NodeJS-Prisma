const crypto = require('crypto');
require('dotenv').config();

const generateCsrfToken = (req, res, next) => {
  let csrfToken = req.cookies.csrfToken;

  if (!csrfToken) {
    csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrfToken', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hora
    });
  }

  req.csrfToken = csrfToken;
  next();
};

function verifyCsrfToken(req, res, next) {
    const clientCsrfToken = req.headers['x-csrf-token'];
    const serverCsrfToken = req.cookies.csrfToken;

    console.log('Client CSRF:', clientCsrfToken);
    console.log('Server CSRF:', serverCsrfToken);

    if (!clientCsrfToken || clientCsrfToken !== serverCsrfToken) {
        return res.status(403).json({ error: 'Token CSRF inválido' });
    }

    next();
}


module.exports = { generateCsrfToken, verifyCsrfToken };