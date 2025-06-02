"use client";
import React, { useState } from 'react';

export default function Payment () {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('1234 5678 9012 3456');
    const [cardName, setCardName] = useState('John Doe');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptOffers, setAcceptOffers] = useState(false);

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

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Valider ma commande
                    </h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Payment */}
                    <div className="space-y-6">
                        {/* Payment Method Selection */}
                        <div className="bg-packify-navy rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6 font-roboto">
                                Choisissez votre méthode de paiement
                            </h2>

                            {/* Card Payment */}
                            <div className="space-y-4">
                                <div
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        paymentMethod === 'card'
                                            ? 'border-packify-pink bg-gray-800'
                                            : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            paymentMethod === 'card' ? 'border-packify-pink' : 'border-gray-400'
                                        }`}>
                                            {paymentMethod === 'card' && (
                                                <div className="w-2.5 h-2.5 bg-packify-pink rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex space-x-2">
                                                <div className="w-8 h-5 bg-red-500 rounded text-xs flex items-center justify-center text-white font-bold">MC</div>
                                                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center text-white font-bold">V</div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Carte bancaire</p>
                                                <p className="text-gray-400 text-sm">Visa, Mastercard, CB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Details */}
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4 mt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Numéro de carte</label>
                                                <input
                                                    type="text"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink"
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength="19"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Nom de carte</label>
                                                <input
                                                    type="text"
                                                    value={cardName}
                                                    onChange={(e) => setCardName(e.target.value)}
                                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Date d'expiration</label>
                                                <input
                                                    type="text"
                                                    value={expiryDate}
                                                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink"
                                                    placeholder="MM/AA"
                                                    maxLength="5"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">CVV</label>
                                                <input
                                                    type="text"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink"
                                                    placeholder="123"
                                                    maxLength="3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* PayPal Option */}
                                <div
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        paymentMethod === 'paypal'
                                            ? 'border-packify-pink bg-gray-800'
                                            : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                    onClick={() => setPaymentMethod('paypal')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            paymentMethod === 'paypal' ? 'border-packify-pink' : 'border-gray-400'
                                        }`}>
                                            {paymentMethod === 'paypal' && (
                                                <div className="w-2.5 h-2.5 bg-packify-pink rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">PayPal</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold">PayPal</p>
                                                <p className="text-gray-400 text-sm">Payer avec votre compte PayPal</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mt-4">Paiement sécurisé</p>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="space-y-3">
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-packify-pink bg-gray-700 border-gray-600 rounded focus:ring-packify-pink"
                                />
                                <span className="text-sm">
                                    J'accepte les <span className="text-packify-pink underline">Conditions Générales de Vente</span>
                                </span>
                            </label>
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={acceptOffers}
                                    onChange={(e) => setAcceptOffers(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-packify-pink bg-gray-700 border-gray-600 rounded focus:ring-packify-pink"
                                />
                                <span className="text-sm">
                                    J'accepte de recevoir des offres personnalisées par mail
                                </span>
                            </label>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-6">
                            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Retour</span>
                            </button>

                            <button
                                disabled={!acceptTerms}
                                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                                    acceptTerms
                                        ? 'bg-packify-pink hover:bg-packify-pink-light text-white transform hover:scale-105'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                CONFIRMER & PAYER
                            </button>
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
                                                activity.category === 'RESTAURANT' ? 'bg-orange-500 text-white' :
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