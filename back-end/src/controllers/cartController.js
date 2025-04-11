const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mostrar os itens do carrinho
const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });
    res.render('cart/cart', { cartItems });
  } catch (err) {
    console.error("Erro ao buscar o carrinho:", err);
    res.status(500).render('error', { message: 'Erro ao carregar o carrinho.' });
  }
};

// Adicionar item ao carrinho
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    console.log("Requisição recebida:");
    console.log("userId:", userId);
    console.log("productId:", productId);

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId ou productId ausente' });
    }

    const parsedProductId = parseInt(productId);
    if (isNaN(parsedProductId)) {
      return res.status(400).json({ error: 'productId inválido' });
    }

    const product = await prisma.product.findUnique({
      where: { id: parsedProductId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const addedItem = await prisma.cart.create({
      data: {
        userId,
        productId: parsedProductId,
      },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      message: `Adicionado ao carrinho: ${product.name}`,
      item: addedItem,
    });

  } catch (err) {
    console.error("Erro no addToCart:", err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Remover item do carrinho
const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.body;
    const parsedCartId = parseInt(cartId);

    if (isNaN(parsedCartId)) {
      return res.status(400).json({ error: 'ID do item do carrinho inválido' });
    }

    await prisma.cart.delete({ where: { id: parsedCartId } });
    res.redirect('/cart');
  } catch (err) {
    console.error("Erro ao remover item do carrinho:", err);
    res.status(500).render('error', { message: 'Erro ao remover item do carrinho.' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
