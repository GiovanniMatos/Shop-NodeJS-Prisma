const express = require('express');
const session = require('express-session');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwtMiddleware = require('./middleware/jwtMiddleware');

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Configuração da sessão
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

// Função para conectar ao banco com retry
async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection failed:', error);
        console.log('Retrying in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
        return connectToDatabase(); // Tenta novamente
    }
}

// Conecta ao banco antes de iniciar as rotas
connectToDatabase().then(() => {
    // Rotas
    const shopRoutes = require('./routes/shopRoutes');
    const authRoutes = require('./routes/authRoutes');
    const cartRoutes = require('./routes/cartRoutes');

    app.use('/', authRoutes);
    app.use('/', shopRoutes);
    app.use('/', jwtMiddleware, cartRoutes);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }).catch(err => {
    console.error('Failed to start server due to database connection issues:', err);
    process.exit(1);
});