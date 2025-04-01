const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

function jwtMiddleware(req, res, next) {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.userId;
        next();
    });
}

module.exports = jwtMiddleware;