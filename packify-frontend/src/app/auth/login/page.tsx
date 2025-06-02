"use client";

import React, { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Login submitted:', formData);
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

                {/* Login Form */}
                <div className="space-y-6">
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
                        />
                        <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                            Afficher le mot de passe
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 text-lg"
                    >
                        SE CONNECTER
                    </button>
                </div>
            </div>
        </div>
    );
}