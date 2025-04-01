const { prisma } = require('../index');

const getShop = async (req, res) => {
  const products = await prisma.product.findMany();
  let userId = null; // Inicializa como null
  if (req.userId) { 
    userId = req.userId;
  }
  res.json({ products, user: userId });
};

module.exports = { getShop };