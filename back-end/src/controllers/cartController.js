const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mostrar os itens do carrinho
const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: req.userId },
      include: { product: true },
      orderBy: { id: 'asc' }, // Ordena pelo ID do carrinho
    });
    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Erro ao buscar o carrinho (API):", err);
    res.status(500).json({ error: 'Erro ao carregar o carrinho.' });
  }
};

// Adicionar item ao carrinho
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId ou productId ausente' });
    }

    const parsedProductId = parseInt(productId);
    if (isNaN(parsedProductId)) {
      return res.status(400).json({ error: 'productId inválido' });
    }

    const existingItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId: parsedProductId,
      },
    });

    let updatedItem;

    if (existingItem) {
      updatedItem = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: 1 } },
        include: { product: true },
      });
    } else {
      updatedItem = await prisma.cart.create({
        data: {
          userId,
          productId: parsedProductId,
          quantity: 1,
        },
        include: { product: true },
      });
    }

    res.status(200).json({ item: updatedItem });
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

const updateCart = async (req, res) => {
  try {
    const { cartId, type } = req.body;
    const parsedCartId = parseInt(cartId);

    if (isNaN(parsedCartId) || !['increment', 'decrement'].includes(type)) {
      return res.status(400).json({ error: 'Dados inválidos para atualização.' });
    }

    const existingItem = await prisma.cart.findUnique({
      where: { id: parsedCartId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item do carrinho não encontrado.' });
    }

    let newQuantity =
      type === 'increment'
        ? existingItem.quantity + 1
        : Math.max(1, existingItem.quantity - 1); // Nunca deixa menos que 1 na quantidade

    await prisma.cart.update({
      where: { id: parsedCartId },
      data: { quantity: newQuantity },
    });

    res.status(200).json({ message: 'Quantidade atualizada com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar item do carrinho:', err);
    res.status(500).json({ error: 'Erro interno ao atualizar o item.' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCart
};
