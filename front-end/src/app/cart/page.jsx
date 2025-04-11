'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      if (!res.ok) throw new Error('Falha ao buscar carrinho');
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error('Erro ao carregar o carrinho:', err);
      setError('Erro ao carregar os itens do carrinho.');
    }
  };

  useEffect(() => {
    const fetchCsrfAndCart = async () => {
      try {
        const { data } = await axios.get('/api/csrf-token', {
          withCredentials: true,
        });
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.error('Erro ao pegar CSRF token:', err);
      }

      fetchCart();
    };

    fetchCsrfAndCart();
  }, []);

  const updateQuantity = async (cartId, type) => {
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ cartId, type }), // type: 'increment' ou 'decrement'
      });

      if (!res.ok) throw new Error('Erro ao atualizar quantidade');
      fetchCart();
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
    }
  };

  const handleRemoveFromCart = async (cartId) => {
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ cartId }),
      });

      if (!res.ok) throw new Error('Erro ao remover item');
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    } catch (err) {
      console.error('Erro ao tentar remover item:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Meu Carrinho</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Seu carrinho está vazio 😢</p>
        ) : (
          <div className="grid gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{item.product.name}</h2>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                    <p className="text-gray-700 font-bold mt-1">
                      R$ {(item.product.price * item.quantity).toFixed(2)}{' '}
                      <span className="text-sm text-gray-500 ml-1">(Qtd: {item.quantity})</span>
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, 'decrement')}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <button
                        onClick={() => updateQuantity(item.id, 'increment')}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
