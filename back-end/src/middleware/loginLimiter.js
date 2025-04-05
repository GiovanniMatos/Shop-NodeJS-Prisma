const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite de 5 tentativas por IP + User-Agent
    keyGenerator: (req) => {
        const hash = crypto.createHash('sha256').update(req.ip + req.headers['user-agent']).digest('hex');
        return hash;
    },
    message: 'Muitas solicitações. Tente novamente mais tarde.',
    handler: (req, res) => {
        return res.status(429).send('Muitas tentativas de login. Tente novamente mais tarde.');
    },
});

module.exports = loginLimiter;