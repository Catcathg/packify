"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

// Initialiser Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Types
interface CartItem {
    id: number;
    name: string;
    location: string;
    category: string;
    image: string;
    description: string;
    price?: number;
}

interface MotCle {
    idMotCle: number;
    nom: string;
}

type PaymentMethod = 'card' | 'paypal';

export default function Payment() {
    const router = useRouter();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
    const [acceptOffers, setAcceptOffers] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // États pour les données du panier
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [categories, setCategories] = useState<MotCle[]>([]);
    const [cartLoading, setCartLoading] = useState(true);
    const [cartTotal, setCartTotal] = useState(0);

    // Prix par défaut si pas défini dans l'activité
    const DEFAULT_PRICE = 49;

    // Récupérer le panier et les catégories depuis l'API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCartLoading(true);

                // Récupérer le panier
                const cartResponse = await fetch('/api/cart');
                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    setCartItems(cartData.items || []);
                }

                // Récupérer les catégories pour l'affichage
                const categoriesResponse = await fetch('/api/motcles');
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    setCategories(categoriesData);
                }
            } catch (err) {
                console.error('Erreur lors du chargement des données:', err);
            } finally {
                setCartLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculer le total du panier
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.price || DEFAULT_PRICE);
        }, 0);
        setCartTotal(total);
    }, [cartItems]);

    // Rediriger si panier vide ou incomplet
    useEffect(() => {
        if (!cartLoading && cartItems.length !== 3) {
            router.push('/cart');
        }
    }, [cartItems.length, cartLoading, router]);

    // Fonction pour obtenir le nom de la catégorie
    const getCategoryName = (categoryId: string): string => {
        const category = categories.find(cat => cat.idMotCle.toString() === categoryId || cat.nom === categoryId);
        return category?.nom || categoryId;
    };

    // Fonction pour obtenir la couleur de la catégorie
    const getCategoryColor = (categoryId: string): string => {
        const categoryName = getCategoryName(categoryId).toUpperCase();
        const colors: { [key: string]: string } = {
            'RESTAURANT': 'bg-orange-500',
            'AVENTURE': 'bg-purple-500',
            'DÉTENTE': 'bg-blue-500',
        };
        return colors[categoryName] || 'bg-gray-500';
    };

    const handlePayment = async () => {
        if (!acceptTerms) {
            setError('Vous devez accepter les conditions générales');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (paymentMethod === 'card') {
                // Redirection vers Stripe Checkout
                const response = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        activities: cartItems,
                        total: cartTotal
                    }),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la création de la session de paiement');
                }

                const { sessionId, error: apiError } = await response.json();

                if (apiError) {
                    throw new Error(apiError);
                }

                // Rediriger vers Stripe Checkout
                const stripe = await stripePromise;
                if (!stripe) {
                    throw new Error('Stripe non initialisé - Vérifiez votre clé publique');
                }

                const { error: stripeError } = await stripe.redirectToCheckout({
                    sessionId: sessionId,
                });

                if (stripeError) {
                    throw new Error(stripeError.message);
                }

            } else if (paymentMethod === 'paypal') {
                // Simulation PayPal
                alert('🚧 PayPal sera bientôt disponible ! Utilisez le paiement par carte pour le moment.');
            }

        } catch (err: any) {
            console.error('Erreur paiement:', err);
            setError(err.message || 'Erreur lors du paiement');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.push('/cart');
    };

    // Affichage de chargement
    if (cartLoading) {
        return (
            <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-packify-pink mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement du panier...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            {/* Afficher seulement si le panier est valide */}
            {cartItems.length === 3 ? (
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

                                <div className="space-y-4">
                                    {/* Card Payment */}
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
                                                    <p className="text-gray-400 text-sm">Visa, Mastercard, CB - Sécurisé par Stripe</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

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
                                                    <p className="text-gray-400 text-sm">Bientôt disponible</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info paiement sécurisé */}
                                <div className="mt-6 bg-green-900/30 border border-green-500 rounded-xl p-4">
                                    <h3 className="font-bold text-green-400 mb-2">🔒 Paiement 100% sécurisé</h3>
                                    <div className="text-sm text-green-300 space-y-1">
                                        <p>• Vos informations bancaires sont protégées par le chiffrement SSL</p>
                                        <p>• Stripe traite plus de 500 milliards d'euros par an en toute sécurité</p>
                                        <p>• Vous serez redirigé vers la page de paiement sécurisée Stripe</p>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm mt-4 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    Paiement sécurisé SSL
                                </p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-900/30 border border-red-500 rounded-2xl p-4">
                                    <p className="text-red-400">❌ {error}</p>
                                </div>
                            )}

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
                                        J'accepte les <span className="text-packify-pink underline cursor-pointer">Conditions Générales de Vente</span> *
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
                                        J'accepte de recevoir des offres personnalisées par email
                                    </span>
                                </label>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center pt-6">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>Retour</span>
                                </button>

                                <button
                                    onClick={handlePayment}
                                    disabled={!acceptTerms || loading}
                                    className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center space-x-2 ${
                                        acceptTerms && !loading
                                            ? 'bg-packify-pink hover:bg-packify-pink-light text-white transform hover:scale-105'
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>REDIRECTION...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                                            </svg>
                                            <span>PAYER {cartTotal}€</span>
                                        </>
                                    )}
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
                                            <p className="text-gray-400 text-sm">{cartItems.length} activités sélectionnées</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{cartTotal}€</p>
                                        </div>
                                    </div>

                                    {/* Selected Activities */}
                                    <div className="mt-4 space-y-3">
                                        <h4 className="font-semibold text-packify-pink text-sm mb-3">Vos activités sélectionnées :</h4>
                                        {cartItems.map((activity, index) => (
                                            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                                                <div className="w-8 h-8 bg-packify-pink rounded-full flex items-center justify-center text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{activity.name}</p>
                                                    <p className="text-gray-400 text-xs">{activity.location}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(activity.category)}`}>
                                                    {getCategoryName(activity.category)}
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
                                        <span className="font-semibold">{cartTotal}€</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Frais de service</span>
                                        <span className="font-semibold text-green-400">Gratuit</span>
                                    </div>

                                    <hr className="border-gray-600" />

                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold">Total</span>
                                        <span className="text-xl font-bold text-packify-pink">{cartTotal}€</span>
                                    </div>
                                </div>

                                {/* Étapes du paiement */}
                                <div className="mt-8 pt-6 border-t border-gray-600">
                                    <h4 className="font-semibold text-sm mb-3">🚀 Étapes suivantes :</h4>
                                    <div className="space-y-2 text-sm text-gray-400">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-packify-pink rounded-full"></div>
                                            <span>Redirection vers Stripe sécurisé</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                            <span>Saisie de vos informations bancaires</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                            <span>Confirmation et retour sur notre site</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={() => router.push('/activities')}
                                        className="w-full text-center text-gray-400 hover:text-packify-pink transition-colors"
                                    >
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
            ) : (
                /* Loading pendant redirection */
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-packify-pink mx-auto mb-4"></div>
                        <p className="text-gray-400">Redirection...</p>
                    </div>
                </div>
            )}
        </div>
    );
}