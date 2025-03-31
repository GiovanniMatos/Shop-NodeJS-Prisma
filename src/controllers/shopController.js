const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getShop = async (req, res) => {
    const products = await prisma.product.findMany();
    let userId = null; // Inicializa userId como null

    if (req.userId) { // Verifica se req.userId existe
        userId = req.userId;
    }

    res.render('shop/index', { products, user: userId }); // Passa userId para a view
};

module.exports = { getShop };