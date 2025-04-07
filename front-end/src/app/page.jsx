"use client";

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está autenticado pela resposta do authController
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
        await axios.post('/api/logout');
        Cookies.remove('username');
        setUsername(null);
        router.push('/');
    } catch (err) {
        console.error('Erro ao fazer logout:', err);
    }
};

  const handleAddToCart = async (productId) => {
    const token = Cookies.get('jwt');
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
            {username ? (
              <div className="flex items-center">
                <span className="mx-2">Bem-vindo, {username}!</span>
                <button onClick={handleLogout} className="mx-2 hover:underline text-white bg-red-500 py-2 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <a href="/login" className="mx-2 hover:underline">Login</a>
                <a href="/register" className="mx-2 hover:underline">Registrar</a>
              </>
            )}
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