"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            console.log('🚀 Tentative de connexion...', { email: formData.email });

            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    mdp: formData.password
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erreur de connexion');
            }

            const data = await response.json();
            console.log('Réponse du serveur:', data);

            localStorage.setItem('token', data.token);
            localStorage.setItem('authToken', data.token);

            const userData = {
                email: data.email || formData.email,
                nom: data.nom || data.name || data.username,
                role: data.role || 'CLIENT'
            };
            localStorage.setItem('user', JSON.stringify(userData));

            setSuccess('Connexion réussie !');
            console.log('Utilisateur connecté:', userData);

            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'token',
                newValue: data.token,
                url: window.location.href
            }));

            setTimeout(() => {
                if (data.role === 'ADMIN' || data.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/cart');
                }
            }, 1000);

        } catch (error) {
            console.error('Erreur de connexion:', error);
            setError(error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
                {/* Toggle Buttons */}
                <div className="flex mb-8">
                    <a
                        href="/auth/register"
                        className={`flex-1 py-3 px-6 rounded-l-2xl font-medium transition-all text-center ${
                            activeTab === 'register'
                                ? 'bg-black text-white'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        S'inscrire
                    </a>
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-3 px-6 rounded-r-2xl font-medium transition-all ${
                            activeTab === 'login'
                                ? 'bg-black text-white'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        Se connecter
                    </button>
                </div>

                {/* Form Title */}
                <h1 className="text-2xl font-bold text-center mb-8 text-black font-roboto">
                    Se connecter
                </h1>

                {/* Messages d'erreur/succès */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        ❌ {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        ✅ {success}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                            required
                            disabled={loading}
                            placeholder="votre@email.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                            required
                            disabled={loading}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Show Password Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="w-4 h-4 text-packify-pink bg-gray-100 border-gray-300 rounded focus:ring-packify-pink focus:ring-2"
                            disabled={loading}
                        />
                        <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                            Afficher le mot de passe
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-bold py-4 px-6 rounded-full transition-all duration-300 text-lg ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-packify-pink hover:bg-packify-pink-light text-white transform hover:scale-105'
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                CONNEXION...
                            </div>
                        ) : (
                            'SE CONNECTER'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}