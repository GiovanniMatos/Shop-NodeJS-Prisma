const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const stripe = require('stripe')(process.env.STRIPE_TOKEN);

exports.checkout = async (req, res) => {
  const userId = req.userId;
  const { cpf, telefone, cep, rua, bairro, numero } = req.body;

  if (!cpf || !telefone || !cep || !rua || !bairro || !numero) {
    return res.status(400).json({ error: 'Preencha todos os dados de entrega.' });
  }

  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Carrinho está vazio.' });
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Cria o pedido no banco de dados
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        cpf,
        telefone,
        cep,
        rua,
        bairro,
        numero,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Limpa o carrinho do banco de dados após a compra
    await prisma.cart.deleteMany({ where: { userId } });

    // Cria sessão Stripe com os dados na metadata que o cliente irá preencher - aparece no Dashboard da Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.product.name,
            description: item.product.description,
          },
          unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.BASE_URL}/sucesso`,
      cancel_url: `${process.env.BASE_URL}/cart`,
      metadata: {
        orderId: order.id,
        cpf,
        telefone,
        cep,
        rua,
        bairro,
        numero,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erro no checkout:', err);
    res.status(500).json({ error: 'Erro ao finalizar o pedido.' });
  }
};
