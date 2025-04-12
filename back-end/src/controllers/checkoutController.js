const stripe = require('stripe')(process.env.STRIPE_TOKEN);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleCheckout = async (req, res) => {
  try {
    const userId = req.userId;

    // Pega os itens do carrinho do usuário
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // conforme a API da Stripe para criar a sessão do checkout
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.product.name,
          description: item.product.description,
        },
        unit_amount: Math.round(item.product.price * 100), // em centavos!
      },
      quantity: item.quantity,
    }));

    // Cria sessão do Checkout da Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/sucesso`,
      cancel_url: `${process.env.BASE_URL}/cancelado`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erro no checkout:', err);
    res.status(500).json({ error: 'Erro ao criar sessão de pagamento.' });
  }
};

module.exports = { handleCheckout };
