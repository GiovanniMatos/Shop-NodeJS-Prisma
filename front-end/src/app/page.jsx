'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCartShopping } from "react-icons/fa6";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      Cookies.remove('username');
      setUsername(null);
      router.push('/');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const { data } = await axios.get('/api/csrf-token', {
        withCredentials: true,
      });

      const csrfToken = data.csrfToken;

      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData?.error || 'Erro ao adicionar produto ao carrinho.');
        return;
      }

      const productName = responseData?.item?.product?.name;

      console.log(`✅ Produto adicionado ao carrinho: ${productName}`);
      setError(null);
      router.push('/cart');
    } catch (err) {
      console.error('Erro no processo de adicionar:', err);
      setError('Você precisa estar logado para adicionar produtos ao carrinho.');
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Pentest Tools</h1>
          <nav>
            {username ? (
              <div className="flex items-center">
                <span className="mx-2">Bem-vindo, {username}!</span>
                <Link href="/cart" className="mx-2">
                  <FaCartShopping className="text-xl cursor-pointer hover:text-gray-200" />
                </Link>
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
              {product.image && (
                <img
                  src={product.image.startsWith("http") ? product.image : `/images/${product.image}`}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">
                {product.description.length > 100
                  ? product.description.slice(0, 100) + '...'
                  : product.description}
              </p>
              <p className="text-gray-600">${product.price}</p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="mt-2 bg-gradient-to-r from-zinc-800 to-zinc-600 text-white font-bold py-2 px-4 rounded"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-zinc-800 p-4 text-center text-gray-200">
        <p>&copy; {new Date().getFullYear()} Pentest Tools. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
