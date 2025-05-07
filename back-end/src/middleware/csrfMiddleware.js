const jwt = require('jsonwebtoken');

function validateCsrfToken(req, res, next) {
    const token = req.cookies.jwt;
    const csrfHeader = req.headers['x-csrf-token'];

    if (!token) {
        return res.status(403).json({ error: 'Usuário não autenticado' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'JWT inválido' });
        }

        if (!csrfHeader || csrfHeader !== decoded.csrfToken) {
            return res.status(403).json({ error: 'CSRF Token inválido' });
        }

        next();
    });
}

module.exports = { validateCsrfToken };
