"use client";
import React, { useState } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('register');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
                {/* Toggle Buttons */}
                <div className="flex mb-8">
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-3 px-6 rounded-l-2xl font-medium transition-all ${
                            activeTab === 'register'
                                ? 'bg-black text-white'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        S'inscrire
                    </button>
                    <a
                        href="/auth/login"
                        className={`flex-1 py-3 px-6 rounded-r-2xl font-medium transition-all text-center ${
                            activeTab === 'login'
                                ? 'bg-black text-white'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        Se connecter
                    </a>
                </div>

                {/* Form Title */}
                <h1 className="text-2xl font-bold text-center mb-8 text-black font-roboto">
                    S'inscrire
                </h1>

                {/* Registration Form */}
                <div className="space-y-6">
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

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

                    {/* Password and Confirm Password */}
                    <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmer votre mot de passe
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Requirements */}
                    <p className="text-xs text-gray-500">
                        Utilisez 8 caractères ou plus avec un mélange de lettres, de chiffres et de symboles
                    </p>

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
                        S'INSCRIRE
                    </button>
                </div>
            </div>
        </div>
    );
}