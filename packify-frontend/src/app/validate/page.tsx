"use client";
import React, { useState } from 'react';

export default function Validate() {
    const [openSection, setOpenSection] = useState(null);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // Activités sélectionnées (simulées - dans un vrai projet, elles viendraient du context/state global)
    const selectedActivities = [
        {
            id: 1,
            name: "Au Milieu des Bulles",
            location: "75007 PARIS",
            category: "RESTAURANT"
        },
        {
            id: 2,
            name: "Les Feuilles d'Or",
            location: "75001 PARIS",
            category: "AVENTURE"
        },
        {
            id: 4,
            name: "L'Heure Anglaise",
            location: "75006 PARIS",
            category: "AVENTURE"
        }
    ];

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = () => {
        console.log('Login:', loginData);
    };

    const handleRegister = () => {
        console.log('Register:', registerData);
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Valider ma commande
                    </h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Auth Forms */}
                    <div className="space-y-4">
                        {/* Section: Je suis déjà inscrit(e) */}
                        <div className="border border-white rounded-2xl overflow-hidden">
                            <button
                                onClick={() => toggleSection('login')}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-900 transition-colors"
                            >
                                <span className="text-lg font-medium">Je suis déjà inscrit(e)</span>
                                <svg
                                    className={`w-6 h-6 transform transition-transform ${
                                        openSection === 'login' ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {openSection === 'login' && (
                                <div className="p-6 pt-4 border-t border-packify-pink bg-gray-900/30">
                                    <h3 className="text-xl font-bold mb-6 font-roboto">Connectez-vous</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Adresse mail</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={loginData.email}
                                                onChange={handleLoginChange}
                                                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Mot de passe</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={loginData.password}
                                                onChange={handleLoginChange}
                                                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                                            />
                                        </div>

                                        <div className="text-left">
                                            <a href="#" className="text-sm text-gray-400 hover:text-packify-pink underline">
                                                Mot de passe oublié ?
                                            </a>
                                        </div>

                                        <button
                                            onClick={handleLogin}
                                            className="w-full bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                                        >
                                            CONNEXION
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section: Je n'ai pas de compte */}
                        <div className="border border-white rounded-2xl overflow-hidden">
                            <button
                                onClick={() => toggleSection('register')}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-900 transition-colors"
                            >
                                <span className="text-lg font-medium">Je n'ai pas de compte</span>
                                <svg
                                    className={`w-6 h-6 transform transition-transform ${
                                        openSection === 'register' ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {openSection === 'register' && (
                                <div className="p-6 pt-4 border-t border-packify-pink bg-gray-900/30">
                                    <h3 className="text-xl font-bold mb-6 font-roboto">Créer un compte</h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Prénom</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={registerData.firstName}
                                                    onChange={handleRegisterChange}
                                                    className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Nom</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={registerData.lastName}
                                                    onChange={handleRegisterChange}
                                                    className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Adresse mail</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={registerData.email}
                                                onChange={handleRegisterChange}
                                                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={registerData.password}
                                                    onChange={handleRegisterChange}
                                                    className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Confirmer votre mot de passe</label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    value={registerData.confirmPassword}
                                                    onChange={handleRegisterChange}
                                                    className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                                                />
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-400">
                                            Utilisez 8 caractères ou plus avec un mélange de lettres, de chiffres et de symboles
                                        </p>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="showPasswordRegister"
                                                checked={showPassword}
                                                onChange={(e) => setShowPassword(e.target.checked)}
                                                className="w-4 h-4 text-packify-pink bg-gray-700 border-gray-600 rounded focus:ring-packify-pink focus:ring-2"
                                            />
                                            <label htmlFor="showPasswordRegister" className="ml-2 text-sm text-gray-300">
                                                Afficher le mot de passe
                                            </label>
                                        </div>

                                        <button
                                            onClick={handleRegister}
                                            className="w-full bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                                        >
                                            CRÉER MON COMPTE
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        <div className="bg-packify-navy rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6 font-roboto">
                                Récapitulatif de votre commande
                            </h2>

                            {/* Product */}
                            <div className="mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg font-roboto">Pack Découverte</h3>
                                        <p className="text-gray-400 text-sm">3 activités au choix</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">69€</p>
                                    </div>
                                </div>

                                {/* Selected Activities */}
                                <div className="mt-4 space-y-3">
                                    <h4 className="font-semibold text-packify-pink text-sm mb-3">Vos activités sélectionnées :</h4>
                                    {selectedActivities.map((activity, index) => (
                                        <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                                            <div className="w-8 h-8 bg-packify-pink rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{activity.name}</p>
                                                <p className="text-gray-400 text-xs">{activity.location}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                activity.category === 'RESTAURANT' ? 'bg-packify-pink text-white' :
                                                    activity.category === 'AVENTURE' ? 'bg-purple-500 text-white' :
                                                        activity.category === 'ACTIVITÉ' ? 'bg-blue-500 text-white' :
                                                            'bg-orange-500 text-white'
                                            }`}>
                                            {activity.category}
                                        </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-gray-600 my-6" />

                            {/* Pricing Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Sous-total</span>
                                    <span className="font-semibold">69€</span>
                                </div>

                                <hr className="border-gray-600" />

                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">Total</span>
                                    <span className="text-xl font-bold">69€</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-600">
                                <button className="w-full text-center text-gray-400 hover:text-packify-pink transition-colors">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Retour à la boutique
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}