const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Rotas
app.use('/api', require('./routes/shopRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/cartRoutes')); 

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Retrying in 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return connectToDatabase();
  }
}

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    module.exports = { prisma }; // Exporta após o servidor iniciar
  })
  .catch(err => {
    console.error('Failed to start server due to database issues:', err);
    process.exit(1);
  });