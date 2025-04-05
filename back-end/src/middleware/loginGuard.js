const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

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

const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(),"by":"validateLogin Middleware" });
        }
        next();
    },
];

const validateRegister = [
    body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), "by": "validateRegister Middleware" });
        }
        next();
    },
];


module.exports = { loginLimiter, validateLogin, validateRegister };