'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Email inválido.');
            return;
        }

        if (!password) {
            setError('Senha é obrigatória.');
            return;
        }

        try {
            const response = await axios.post('/api/login', { email, password });
            if (response.data.username) {
                Cookies.set('username', response.data.username, {
                    expires: 1,
                    secure: true,
                    sameSite: 'Strict',
                });
            }

            router.push('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao fazer login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-gray-400 to-gray-600">
            <div className="flex w-full max-w-5xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-1/2 p-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo à loja</h1>
                    <p className="text-white text-lg">
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                    </p>
                </div>
                <div className="w-1/2 p-12 bg-white">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Acessar conta</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-md focus:ring focus:ring-indigo-200"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded-md focus:ring focus:ring-indigo-200"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <a href="/register" className="text-sm text-indigo-600">Criar uma conta</a>
                            </label>
                            <a href="#" className="text-sm text-indigo-600">Esqueci minha senha</a>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-600 text-white rounded-md"
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}