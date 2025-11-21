"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Interfaces TypeScript
interface Activity {
    id: number;
    name: string;
    location: string;
    category: string;
    categoryLabel?: string;
    image: string;
    description: string;
}

interface User {
    id: number;
    email: string;
    nom: string;
}

interface ApiOptions extends RequestInit {
    headers?: Record<string, string>;
}

export default function Cart() {
    const router = useRouter();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [stripeLoaded, setStripeLoaded] = useState<boolean>(false);

    // Vérification de l'authentification
    const checkAuth = (): string | null => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const userData = userStr ? JSON.parse(userStr) as User : null;

            setIsAuthenticated(!!token);
            setUser(userData);
            return token;
        } catch (error) {
            console.error('Erreur lors de la vérification d\'authentification:', error);
            setIsAuthenticated(false);
            setUser(null);
            return null;
        }
    };

    // Fonction pour faire des appels API
    const apiCall = async (endpoint: string, options: ApiOptions = {}): Promise<any> => {
        const token = localStorage.getItem('token');

        const defaultOptions: ApiOptions = {
            mode: 'cors',
            credentials: 'omit', // Ajouté pour Safari
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const finalOptions: ApiOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);

            if (!response.ok) {
                // Essayer de lire le message d'erreur du serveur
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.text();
                    if (errorData) {
                        errorMessage += ` - ${errorData}`;
                    }
                } catch (e) {
                    // Ignore si on ne peut pas lire la réponse
                }
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    };

    // Charger les activités du panier depuis localStorage
    const loadCartActivities = (): void => {
        try {
            // Récupérer les objets complets depuis localStorage
            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]') as Activity[];
            console.log('Cart items loaded:', cartItems);

            // Vérifier si ce sont des objets valides
            if (cartItems.length > 0) {
                if (typeof cartItems[0] === 'object' && 'id' in cartItems[0]) {
                    // C'est déjà des objets complets
                    setActivities(cartItems);
                } else {
                    // C'est des IDs, mais on ne peut pas les récupérer facilement
                    console.warn('Les données du panier semblent être des IDs, pas des objets complets');
                    setActivities([]);
                }
            } else {
                setActivities([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du panier:', error);
            setError('Erreur lors du chargement du panier');
            setActivities([]);
        }
    };

    // Supprimer une activité du panier
    const removeActivity = (activityId: number): void => {
        try {
            // Supprimer de l'état local
            const updatedActivities = activities.filter(activity => activity.id !== activityId);
            setActivities(updatedActivities);

            // Mettre à jour localStorage avec les objets complets
            localStorage.setItem('cart', JSON.stringify(updatedActivities));

            // Déclencher un événement pour synchroniser avec d'autres onglets/composants
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'cart',
                newValue: JSON.stringify(updatedActivities)
            }));

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setError('Erreur lors de la suppression de l\'activité');
        }
    };

    // Vider le panier
    const clearCart = (): void => {
        try {
            setActivities([]);
            localStorage.setItem('cart', JSON.stringify([]));

            // Déclencher un événement pour synchroniser
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'cart',
                newValue: JSON.stringify([])
            }));
        } catch (error) {
            console.error('Erreur lors du vidage du panier:', error);
            setError('Erreur lors du vidage du panier');
        }
    };

    // Calculer le total (le prix est fixe à 69€ pour le pack)
    const getCartTotal = (): number => {
        return activities.length > 0 ? 69 : 0;
    };

    // Compter les activités
    const getCartCount = (): number => {
        return activities.length;
    };

    // Traitement du paiement - Version Stripe directe
    const handlePaymentStripe = async (): Promise<void> => {
        if (!isAuthenticated || !user) {
            router.push('/auth/login');
            return;
        }

        if (!stripeLoaded) {
            setError('Stripe n\'est pas encore chargé. Veuillez réessayer dans quelques secondes.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const activitiesInCart = [...activities];

            // Appel direct à Stripe
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activities: activitiesInCart
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de la session de paiement');
            }

            const { sessionId } = await response.json();

            // Vérifier que Stripe est disponible
            if (typeof (window as any).Stripe !== 'function') {
                throw new Error('Stripe n\'est pas chargé correctement');
            }

            // Redirection vers Stripe Checkout
            const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Erreur Stripe:', error);
                setError('Erreur lors de la redirection vers le paiement');
            }

        } catch (error) {
            console.error('Erreur lors du paiement:', error);
            setError('Erreur lors de la création du paiement. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };
    const handlePayment = async (): Promise<void> => {
        if (!isAuthenticated || !user) {
            router.push('/auth/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const total = getCartTotal();
            const activitiesInCart = [...activities];

            console.log('Utilisateur:', user);
            console.log('Activités dans le panier:', activitiesInCart);

            // 1. Données adaptées à l'entité Commander
            const commandeData = {
                // Adaptez ces champs selon votre entité Commander
                dateCommande: new Date().toISOString().split('T')[0],
                statut: 'EN_ATTENTE',
                montantTotal: total,
                // Ces champs dépendent de votre entité Commander
                utilisateurId: user.id,  // ou utilisateur: { id: user.id }
                activitiesIds: activitiesInCart.map(activity => activity.id)  // ou activities: [...]
            };

            console.log('Données à envoyer pour la commande:', JSON.stringify(commandeData, null, 2));

            // Test d'abord l'endpoint de test
            console.log('Test de l\'endpoint...');
            try {
                const testResult = await apiCall('/commandes/test', {
                    method: 'POST',
                    body: JSON.stringify({ test: 'data' })
                });
                console.log('Test endpoint réussi:', testResult);
            } catch (testError) {
                console.error('Erreur test endpoint:', testError);
                setError('Erreur: Endpoint commandes non accessible');
                return;
            }

            console.log('Création de la commande...');

            console.log('Création de la commande:', commandeData);
            const commande = await apiCall('/commandes/save', {
                method: 'POST',
                body: JSON.stringify(commandeData)
            });

            console.log('Commande créée:', commande);

            // 2. Créer une facture
            const factureData = {
                numeroFacture: `FACT-${Date.now()}`,
                dateFacture: new Date().toISOString().split('T')[0],
                montantHT: parseFloat((total / 1.2).toFixed(2)),
                montantTTC: total,
                tauxTva: 20, // ou taux_tva selon votre entité
                statut: 'EN_ATTENTE_PAIEMENT',
                commande: { id: commande.id }, // ou commandeId selon votre backend
                utilisateur: { id: user.id } // ou userId selon votre backend
            };

            console.log('Création de la facture:', factureData);
            const facture = await apiCall('/factures/save', {
                method: 'POST',
                body: JSON.stringify(factureData)
            });

            console.log('Facture créée:', facture);

            // 3. Vider le panier après succès
            clearCart();

            // 4. Rediriger vers la page de paiement
            router.push(`/payment?commandeId=${commande.id}&factureId=${facture.id}`);

        } catch (error) {
            console.error('Erreur lors de la création de la commande/facture:', error);
            setError('Erreur lors de la création de la commande. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = (): void => {
        router.back();
    };

    // useEffect pour charger les données et Stripe
    useEffect(() => {
        checkAuth();
        loadCartActivities();

        // Charger Stripe
        const loadStripe = () => {
            if (!(window as any).Stripe) {
                const script = document.createElement('script');
                script.src = 'https://js.stripe.com/v3/';
                script.onload = () => {
                    setStripeLoaded(true);
                };
                document.head.appendChild(script);
            } else {
                setStripeLoaded(true);
            }
        };

        loadStripe();

        const handleStorageChange = (e: StorageEvent): void => {
            if (e.key === 'cart') {
                loadCartActivities();
            }
            if (e.key === 'token' || e.key === 'user') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Affichage des erreurs */}
                {error && (
                    <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-400">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-300 hover:text-red-200 text-sm underline mt-2"
                        >
                            Fermer
                        </button>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                            Mon panier
                        </h1>
                        {activities.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-red-400 hover:text-red-300 text-sm underline transition-colors"
                            >
                                Vider le panier
                            </button>
                        )}
                    </div>

                    {/* Affichage conditionnel du statut utilisateur */}
                    {isAuthenticated && user && (
                        <div className="mt-4 text-sm text-gray-400">
                            Connecté en tant que <span className="text-packify-pink">{user.email} {user.nom}</span>
                        </div>
                    )}
                </div>

                {/* Contenu conditionnel selon l'état du panier */}
                {activities.length > 0 ? (
                    <>
                        {/* Pack Info */}
                        <div className="mb-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold font-roboto">Pack Découverte</h2>
                                    <p className="text-gray-400">
                                        {getCartCount()} activité{getCartCount() > 1 ? 's' : ''} incluse{getCartCount() > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="text-3xl font-bold">
                                    {getCartTotal()}€
                                </div>
                            </div>
                        </div>

                        {/* Selected Activities */}
                        <div className="space-y-4 mb-8">
                            {activities.map((activity) => (
                                <div key={activity.id} className="bg-packify-pink rounded-2xl p-6 relative">
                                    {/* Bouton de suppression - Croix */}
                                    <button
                                        onClick={() => removeActivity(activity.id)}
                                        className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300"
                                        title="Retirer cette activité"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>

                                    <h3 className="text-xl font-bold mb-2 font-roboto text-white pr-12">
                                        {activity.name}
                                    </h3>

                                    <div className="flex items-center justify-between text-white/90 text-sm mb-3">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                            <span className="font-medium">{activity.location}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            activity.categoryLabel === 'Restaurant' ? 'bg-orange-500 text-white' :
                                                activity.categoryLabel === 'Aventure' ? 'bg-purple-500 text-white' :
                                                    activity.categoryLabel === 'Détente' ? 'bg-blue-500 text-white' :
                                                        'bg-gray-500 text-white'
                                        }`}>
                                            {activity.categoryLabel}
                                        </span>
                                    </div>
                                    <p className="text-white/90 text-sm leading-relaxed">
                                        {activity.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <hr className="border-white/20 my-8"/>

                        {/* Total */}
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold font-roboto">Sous-total</h3>
                            <div className="text-3xl font-bold">
                                {getCartTotal()}€
                            </div>
                        </div>

                        {/* Actions conditionnelles selon le nombre d'activités */}
                        <div className="space-y-4">
                            {getCartCount() === 3 ? (
                                <>
                                    {/* Pack complet - Bouton PAYER conditionnel */}
                                    <div className="bg-green-900/30 border border-green-500 rounded-2xl p-4 mb-4">
                                        <div className="flex items-center justify-center space-x-2 text-green-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span className="font-bold">
                                                {isAuthenticated ? 'Pack complet ! Prêt pour le paiement' : 'Pack complet ! Connectez-vous pour payer'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePaymentStripe}
                                        disabled={loading}
                                        className="w-full bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                TRAITEMENT...
                                            </div>
                                        ) : !stripeLoaded ? (
                                            'CHARGEMENT STRIPE...'
                                        ) : (
                                            isAuthenticated ? 'PAYER MAINTENANT' : 'SE CONNECTER POUR PAYER'
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Pack incomplet - Message et bouton continuer */}
                                    <div className="bg-yellow-900/30 border border-yellow-500 rounded-2xl p-4 mb-4">
                                        <div className="flex items-center justify-center space-x-2 text-yellow-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"/>
                                            </svg>
                                            <span className="font-bold">
                                                Il vous manque {3 - getCartCount()} activité{3 - getCartCount() > 1 ? 's' : ''} pour compléter votre pack
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push('/activities')}
                                        className="w-full bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        CONTINUER MES ACHATS
                                    </button>
                                </>
                            )}

                            {/* Bouton retour */}
                            <button
                                onClick={handleClose}
                                className="w-full border-2 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white font-bold py-3 px-8 rounded-2xl text-lg transition-all duration-300"
                            >
                                RETOUR
                            </button>
                        </div>
                    </>
                ) : (
                    /* État panier vide */
                    <div className="flex flex-col items-center justify-center py-24">
                        {/* Icône panier */}
                        <div className="mb-8">
                            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z"/>
                            </svg>
                        </div>

                        {/* Texte */}
                        <h3 className="text-xl font-bold mb-4 text-center font-roboto">
                            VOTRE PANIER EST VIDE
                        </h3>
                        <p className="text-gray-400 text-center mb-8 max-w-md">
                            Découvrez nos activités exceptionnelles et créez votre pack personnalisé pour des expériences inoubliables.
                        </p>

                        {/* Boutons */}
                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/activities')}
                                className="bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                DÉCOUVRIR LES ACTIVITÉS
                            </button>
                            <button
                                onClick={handleClose}
                                className="block text-gray-400 hover:text-white text-sm underline transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}