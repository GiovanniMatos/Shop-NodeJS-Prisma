const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getCart = async (req, res) => {
  const cartItems = await prisma.cart.findMany({
    where: { userId: req.session.userId },
    include: { product: true },
  });
  res.render('cart/cart', { cartItems }); // Ajustado para subpasta
};

const addToCart = async (req, res) => {
  const { productId } = req.body;
  await prisma.cart.create({
    data: {
      userId: req.session.userId,
      productId: parseInt(productId),
    },
  });
  res.redirect('/');
};

const removeFromCart = async (req, res) => {
  const { cartId } = req.body;
  await prisma.cart.delete({ where: { id: parseInt(cartId) } });
  res.redirect('/cart');
};

module.exports = { getCart, addToCart, removeFromCart };