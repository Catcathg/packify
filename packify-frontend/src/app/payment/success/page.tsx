"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [clearingCart, setClearingCart] = useState(false);
    const [cartCleared, setCartCleared] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Vider le panier après un paiement réussi
    useEffect(() => {
        const clearCart = async (): Promise<void> => {
            if (sessionId && !cartCleared) {
                try {
                    setClearingCart(true);

                    // Vider le localStorage directement
                    localStorage.removeItem('cart');

                    // Déclencher un événement pour synchroniser avec d'autres onglets
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: 'cart',
                        newValue: null
                    }));

                    setCartCleared(true);
                    console.log('Panier vidé avec succès après paiement');

                } catch (err) {
                    console.error('Erreur lors du vidage du panier:', err);
                    setError('Erreur lors du vidage du panier');
                } finally {
                    setClearingCart(false);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        clearCart();
    }, [sessionId, cartCleared]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-packify-pink mx-auto mb-4"></div>
                    <p>Finalisation de votre commande...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="text-center py-16">
                    {/* Icône de succès */}
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                    </div>

                    {/* Titre */}
                    <h1 className="text-4xl font-bold font-roboto mb-4 text-green-400">
                        Paiement réussi ! 🎉
                    </h1>

                    {/* Message */}
                    <p className="text-xl text-gray-300 mb-8">
                        Félicitations ! Votre Pack Découverte a été acheté avec succès.
                    </p>

                    {/* Informations */}
                    <div className="bg-gray-900 rounded-2xl p-6 mb-8">
                        <h2 className="text-lg font-bold mb-4 text-packify-pink">Que se passe-t-il maintenant ?</h2>
                        <div className="text-left space-y-3 text-gray-300">
                            <div className="flex items-start space-x-3">
                                <span className="text-green-400">✅</span>
                                <p>Vos activités sont réservées et valables sans limite de temps</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                {clearingCart ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-packify-pink mt-1"></div>
                                ) : cartCleared ? (
                                    <span className="text-green-400">✅</span>
                                ) : (
                                    <span className="text-yellow-400">⏳</span>
                                )}
                                <p>
                                    {clearingCart
                                        ? "Vidage du panier en cours..."
                                        : cartCleared
                                            ? "Votre panier a été automatiquement vidé"
                                            : "Votre panier sera automatiquement vidé"
                                    }
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-green-400">✅</span>
                                <p>Un email de confirmation vous sera envoyé sous peu</p>
                            </div>
                        </div>
                    </div>

                    {/* Erreur si problème avec le vidage du panier */}
                    {error && (
                        <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 mb-6">
                            <p className="text-yellow-400 text-sm">
                                <strong>Note :</strong> {error} (cela n'affecte pas votre commande)
                            </p>
                        </div>
                    )}

                    {/* Session ID pour debug */}
                    {sessionId && (
                        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 mb-6">
                            <p className="text-blue-400 text-sm">
                                <strong>Référence de transaction :</strong> {sessionId.substring(0, 20)}...
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105"
                        >
                            RETOUR À L'ACCUEIL
                        </button>

                        <button
                            onClick={() => router.push('/activities')}
                            className="w-full border-2 border-packify-pink text-packify-pink hover:bg-packify-pink hover:text-white font-bold py-3 px-8 rounded-2xl text-lg transition-all duration-300"
                        >
                            DÉCOUVRIR D'AUTRES ACTIVITÉS
                        </button>
                    </div>

                    {/* Message de remerciement */}
                    <div className="mt-12 pt-8 border-t border-gray-700">
                        <p className="text-gray-400 text-sm">
                            Merci de votre confiance ! 💕<br/>
                            L'équipe Packify vous souhaite d'excellentes expériences.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}