const crypto = require('crypto');
require('dotenv').config();

function generateCsrfToken(req, res, next) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrfToken', csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hora de expiração
    });
    req.csrfToken = csrfToken;
    next();
}

function verifyCsrfToken(req, res, next) {
    const clientCsrfToken = req.headers['x-csrf-token'];
    const serverCsrfToken = req.cookies.csrfToken;

    if (!clientCsrfToken || clientCsrfToken !== serverCsrfToken) {
        return res.status(403).json({ error: 'Token CSRF inválido' });
    }
    next();
}

module.exports = { generateCsrfToken, verifyCsrfToken };