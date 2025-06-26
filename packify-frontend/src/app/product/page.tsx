"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types
interface TypePack {
    idTypePack?: number;
    nom?: string;
    description?: string;
    prix?: number;
    img?: string;
}

export default function Product() {
    const router = useRouter();
    const [typePack, setTypePack] = useState<TypePack | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour faire des appels API
    const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const finalOptions: RequestInit = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, finalOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    };

    // Charger le TypePack
    const loadTypePack = async () => {
        try {
            setLoading(true);
            setError(null);

            const typePackData = await apiCall('/api/v1/typePacks/findById?id=1');
            setTypePack(typePackData);

        } catch (error) {
            console.error('Erreur lors du chargement du TypePack:', error);
            setError('Erreur lors du chargement du pack');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTypePack();
    }, []);

    const handleMenuClick = () => {
        router.push('/');
    };

    const handleDiscoverProduct = () => {
        router.push('/activities');
    };

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            {/* Section Hero - Fond noir */}
            <section className="bg-black text-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Bouton Retour */}
                    <button
                        onClick={handleMenuClick}
                        className="flex items-center space-x-3 mb-12 hover:text-packify-pink transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-6 h-6"/>
                        <span className="text-lg font-medium">RETOUR</span>
                    </button>

                    {/* Contenu principal */}
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Card Pack Découverte */}
                        <div className="bg-white text-black rounded-3xl p-8 m-6 text-center max-w-sm">
                            {loading ? (
                                /* État de chargement */
                                <div className="animate-pulse">
                                    <div className="w-65 h-65 mx-auto bg-gray-200 rounded-lg mb-6"></div>
                                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Image parachute */}
                                    <div className="mb-6">
                                        <img
                                            src={
                                                typePack?.img && typePack.img !== 'https://ibb.co/gM4g8Prh'
                                                    ? typePack.img
                                                    : "/assets/parachute_box.png"
                                            }
                                            alt={typePack?.nom || "Pack Découverte"}
                                            className="w-65 h-65 mx-auto object-contain"
                                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/assets/parachute_box.png";
                                            }}
                                        />
                                    </div>

                                    <h2 className="text-xl font-bold mb-4 font-roboto">
                                        {typePack?.nom?.toUpperCase()}
                                    </h2>
                                    <p className="text-gray-600 mb-8 font-inter">
                                        {typePack?.description}
                                    </p>

                                    <button
                                        onClick={handleDiscoverProduct}
                                        className="bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-3 px-8 rounded-full w-full transition-all duration-300"
                                    >
                                        {typePack?.prix}€
                                    </button>

                                    {/* Affichage d'erreur si présente */}
                                    {error && (
                                        <div className="mt-4 text-xs text-red-500 text-center">
                                            ⚠️ Erreur de chargement
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Description du pack */}
                        <div className="space-y-6">
                            {loading ? (
                                /* État de chargement pour la description */
                                <div className="animate-pulse">
                                    <div className="h-12 bg-gray-700 rounded mb-6"></div>
                                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-6"></div>
                                    <div className="bg-gray-700 rounded-2xl p-6 h-48"></div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-bold font-roboto">
                                        {typePack?.nom?.toUpperCase()}
                                    </h1>

                                    <p className="text-lg font-inter leading-relaxed">
                                        Offrez-vous une <span className="text-packify-pink font-semibold">expérience sur-mesure</span> avec le {typePack?.nom}.
                                    </p>

                                    <p className="text-gray-300 font-inter leading-relaxed">
                                        Conçu pour ceux qui rêvent d'évasion et de nouveautés, ce pack vous permet de
                                        choisir <span className="font-semibold text-white">3 activités parmi notre sélection variée</span> pour
                                        éveiller votre curiosité et redécouvrir le plaisir authentique de la découverte.
                                    </p>

                                    {/* Box "Ce qui vous attend" */}
                                    <div className="bg-packify-navy rounded-2xl p-6 border-l-4 border-packify-pink">
                                        <h3 className="text-white font-bold mb-4 font-roboto">Ce qui vous attend :</h3>
                                        <ul className="space-y-3 text-gray-300 font-inter">
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                                3 activités au choix parmi une sélection variée
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                                Des expériences sélectionnées pour leur qualité et leur originalité
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                                Une aventure personnalisée pour sortir de votre routine quotidienne
                                            </li>
                                            <li className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                                Prix fixe de {typePack?.prix}€ pour tout le pack
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Comment ça marche */}
            <section className="bg-packify-navy text-white py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Titre section */}
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-roboto">
                        Comment ça marche
                    </h2>

                    {/* Étapes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Étape 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                                1
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-roboto">
                                Achetez votre pack
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Réception immédiate par email
                            </p>
                        </div>

                        {/* Étape 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                                2
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-roboto">
                                Réservez vos activités
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Selon vos envies et disponibilités
                            </p>
                        </div>

                        {/* Étape 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                                3
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-roboto">
                                Profitez de votre expérience
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Présentez simplement votre réservation
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section CTA finale */}
            <section className="bg-packify-black text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-roboto">
                        Prêt à commencer votre aventure ?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 font-inter max-w-3xl mx-auto">
                        Découvrez nos activités exceptionnelles et composez votre pack personnalisé dès maintenant.
                    </p>

                    <button
                        onClick={handleDiscoverProduct}
                        className="bg-packify-pink hover:bg-packify-pink-light text-white text-xl font-semibold px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        DÉCOUVRIR LES ACTIVITÉS
                    </button>
                </div>
            </section>
        </div>
    );
}