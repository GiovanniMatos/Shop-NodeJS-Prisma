'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      if (!res.ok) throw new Error('Falha ao buscar carrinho');
      const data = await res.json();
      setCartItems(data);
      const total = data.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      setTotalPrice(total);
    } catch (err) {
      console.error('Erro ao carregar o carrinho:', err);
      setError('Erro ao carregar os itens do carrinho.');
    }
  };

  const fetchAddressByCep = async (cepDigitado) => {
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cepDigitado}/json/`);
      if (!data.erro) {
        setRua(data.logradouro);
        setBairro(data.bairro);
      }
    } catch (err) {
      console.error('Erro ao buscar endereço pelo CEP:', err);
    }
  };

  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCep(value);
    if (value.length === 8) fetchAddressByCep(value);
  };

  useEffect(() => {
    const fetchCsrfAndCart = async () => {
      try {
        const { data } = await axios.get('/api/csrf-token', { withCredentials: true });
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
        body: JSON.stringify({ cartId, type }),
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
      fetchCart();
    } catch (err) {
      console.error('Erro ao tentar remover item:', err);
    }
  };

  const handleCheckout = async () => {
    try {
      const { data } = await axios.post('/api/checkout', {
        cpf,
        telefone,
        cep,
        rua,
        bairro,
        numero,
      }, {
        headers: { 'x-csrf-token': csrfToken },
        withCredentials: true,
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Erro ao iniciar checkout:', err);
    }
  };

  return (
    <main className="flex justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Meu Carrinho</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Seu carrinho está vazio 😢</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 grid gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{item.product.name}</h2>
                      <p className="text-sm text-gray-500">{item.product.description}</p>
                      <p className="text-gray-700 font-bold mt-1">
                        R$ {(item.product.price * item.quantity).toFixed(2)}{' '}
                        <span className="text-sm text-gray-500 ml-1">(Qtd: {item.quantity})</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, 'decrement')} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">−</button>
                        <button onClick={() => updateQuantity(item.id, 'increment')} className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">+</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-600 hover:underline text-sm">Remover</button>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow h-fit">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumo do Pedido</h2>
              <p className="text-gray-600 text-lg mb-4">
                Total: <span className="font-semibold">R$ {totalPrice.toFixed(2)}</span>
              </p>

              <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full mb-3 px-4 py-2 border rounded-md" />
              <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full mb-3 px-4 py-2 border rounded-md" />
              <input type="text" placeholder="CEP" value={cep} onChange={handleCepChange} maxLength={8} className="w-full mb-3 px-4 py-2 border rounded-md" />
              <input type="text" placeholder="Rua" value={rua} onChange={(e) => setRua(e.target.value)} className="w-full mb-3 px-4 py-2 border rounded-md" />
              <input type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full mb-3 px-4 py-2 border rounded-md" />
              <input type="text" placeholder="Número da casa" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded-md" />

              <button onClick={handleCheckout} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
