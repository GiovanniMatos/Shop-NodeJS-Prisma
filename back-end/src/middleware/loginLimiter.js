const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// config do email
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => {
        const hash = crypto.createHash('sha256').update(req.ip + req.headers['user-agent']).digest('hex');
        return hash;
    },
    message: 'Muitas solicitações. Tente novamente mais tarde.',
    handler: async (req, res, next) => {
        if (req.rateLimit.remaining <= 0) {
            try {
                const user = await prisma.user.findFirst({
                    where: { email: req.body.email },
                    select: { email: true },
                });

                if (user && user.email) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: 'Alerta de Tentativa de Acesso à sua conta!!!',
                        text: `Alerta de brute force login no IP ${req.ip} com user-agent ${req.headers['user-agent']}.`,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Erro ao enviar e-mail:', error);
                        } else {
                            console.log('E-mail enviado:', info.response);
                        }
                    });
                } else {
                    console.warn('E-mail do usuário não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar e-mail do usuário:', error);
            }

            return res.status(429).send('Muitas tentativas de login. Tente novamente mais tarde.');
        } else {
            next();
        }
    },
});

module.exports = loginLimiter;