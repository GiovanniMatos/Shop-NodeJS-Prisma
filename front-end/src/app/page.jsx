"use client";

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
          const token = Cookies.get('token');
          setUser(!!token);
        } else {
          setError('Erro ao carregar os produtos.');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor.');
        console.error('Erro na loja:', err);
      }
    }

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = Cookies.get('token');
    if (!token) {
      setError('Você precisa estar logado para adicionar produtos ao carrinho.');
      return;
    }

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        console.log('Produto adicionado ao carrinho.');
      } else {
        setError('Erro ao adicionar produto ao carrinho.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
      console.error('Erro ao adicionar ao carrinho:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-indigo-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Minha Loja</h1>
          <nav>
            <a href="/login" className="mx-2 hover:underline">Login</a>
            <a href="/register" className="mx-2 hover:underline">Registrar</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Minha Loja. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}