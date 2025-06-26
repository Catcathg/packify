"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Types
interface TypePack {
    id?: number;
    nom?: string;
    description?: string;
    prix?: number;
    img?: string;
}

export default function HomePage() {
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

    // Charger le TypePack depuis la première activité (puisque toutes ont le même typePack)
    const loadTypePack = async () => {
        try {
            setLoading(true);
            setError(null);

            // Récupérer toutes les activités
            const activitiesData = await apiCall('/api/v1/activities/getAll');

            if (activitiesData && activitiesData.length > 0) {
                // Extraire le typePack de la première activité
                const firstActivity = activitiesData[0];
                if (firstActivity.typePack) {
                    setTypePack({
                        id: firstActivity.typePack.idTypePack,
                        nom: firstActivity.typePack.nom,
                        description: firstActivity.typePack.description,
                        prix: firstActivity.typePack.prix,
                        img: firstActivity.typePack.img,
                    });
                } else {
                    throw new Error('Pas de typePack dans les activités');
                }
            } else {
                throw new Error('Aucune activité trouvée');
            }

        } catch (error) {
            console.error('Erreur lors du chargement du TypePack:', error);
            setError('Erreur lors du chargement du pack');

            // Fallback - données par défaut basées sur votre base de données
            setTypePack({
                nom: 'PACK DÉCOUVERTE',
                description: '3 activités au choix',
                prix: 69,
                img: 'https://ibb.co/gM4g8Prh',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTypePack();
    }, []);

    const handleDiscoverClick = () => {
        router.push('/product');
    };

    const handlePackClick = () => {
        router.push('/activities');
    };

    return (
        <div className="min-h-screen font-inter">
            {/* Section Hero - Fond noir */}
            <section className="bg-black text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Titre principal */}
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 font-roboto">
                        Créez votre expérience unique
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 font-inter">
                        Découvrez les meilleures activités et créez votre pack personnalisé pour des expériences
                        inoubliables.
                    </p>

                    {/* Image parachute */}
                    <div className="mb-12 flex justify-center">
                        <img
                            src="/assets/parachute_box.png"
                            alt="Parachute avec boîte cadeau"
                            className="w-48 h-48 md:w-64 md:h-64 object-contain"
                        />
                    </div>

                    {/* Bouton CTA avec lien */}
                    <button
                        onClick={handleDiscoverClick}
                        className="bg-packify-pink hover:bg-packify-pink-light text-white text-xl font-semibold px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        DÉCOUVRIR
                    </button>
                </div>
            </section>

            {/* Section Comment ça marche - Fond marine */}
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
                                Choisissez un pack
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Sélectionnez notre pack découverte
                            </p>
                        </div>

                        {/* Étape 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                                2
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-roboto">
                                Personnalisez
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Composez votre pack avec les activités qui vous plaisent
                            </p>
                        </div>

                        {/* Étape 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                                3
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-roboto">
                                Réservez
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Réservez votre pack et profitez le quand vous le voulez
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Notre pack - Fond noir */}
            <section className="bg-packify-black text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 font-roboto">
                        Notre pack
                    </h2>

                    {/* Card Pack Découverte avec données dynamiques */}
                    <div className="bg-white text-packify-black rounded-3xl p-8 max-w-md mx-auto">
                        {loading ? (
                            /* État de chargement */
                            <div className="animate-pulse">
                                <div className="w-80 h-80 mx-auto bg-gray-200 rounded-lg mb-6"></div>
                                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                            </div>
                        ) : (
                            <>
                                {/* Image parachute dans la card */}
                                <div className="mb-6">
                                    <img
                                        src={
                                            typePack?.img && typePack.img !== 'https://ibb.co/gM4g8Prh'
                                                ? typePack.img
                                                : "/assets/parachute_box.png"
                                        }
                                        alt={typePack?.nom || "Pack Découverte"}
                                        className="w-80 h-80 mx-auto object-contain"
                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/assets/parachute_box.png";
                                        }}
                                    />
                                </div>

                                <h3 className="text-2xl font-bold mb-2 font-roboto">
                                    {typePack?.nom?.toUpperCase() || 'PACK DÉCOUVERTE'}
                                </h3>
                                <p className="text-gray-600 mb-6 font-inter">
                                    {typePack?.description || '3 activités au choix'}
                                </p>

                                {/* Bouton avec prix dynamique */}
                                <button
                                    onClick={handlePackClick}
                                    className="bg-packify-pink hover:bg-packify-pink-light text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                >
                                    {typePack?.prix}€
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Section CTA finale - Fond noir */}
            <section className="bg-packify-black text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-roboto">
                        Prêt à créer votre expérience ?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 font-inter max-w-3xl mx-auto">
                        Créez des souvenirs inoubliables à votre rythme. Notre pack s'adapte à vos envies et disponibilités, sans aucune limite de temps.
                    </p>

                    {/* Bouton CTA final avec lien */}
                    <button
                        onClick={handleDiscoverClick}
                        className="bg-packify-pink hover:bg-packify-pink-light text-white text-xl font-semibold px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        DÉCOUVRIR
                    </button>
                </div>
            </section>
        </div>
    );
}