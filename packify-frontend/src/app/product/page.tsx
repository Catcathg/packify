import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Product() {
    return (
        <div className="min-h-screen bg-black text-white font-inter">
            {/* Section Hero - Fond noir */}
            <section className="bg-black text-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Bouton Retour */}
                    <div className="flex items-center space-x-3 mb-12">
                        <ArrowLeft className="w-6 h-6"/>
                        <span className="text-lg font-medium">RETOUR</span>
                    </div>

                    {/* Contenu principal */}
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Card Pack Découverte */}
                        <div className="bg-white text-black rounded-3xl p-8 text-center max-w-sm">
                            {/* Image parachute */}
                            <div className="mb-6">
                                <img
                                    src="/assets/parachute_box.png"
                                    alt="Pack Découverte"
                                    className="w-65 h-65 mx-auto object-contain"
                                />
                            </div>

                            <h2 className="text-xl font-bold mb-4 font-roboto">PACK DÉCOUVERTE</h2>
                            <p className="text-gray-600 mb-8 font-inter">3 activités au choix</p>

                            <button
                                className="bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-3 px-8 rounded-full w-full transition-all duration-300">
                                69€
                            </button>
                        </div>

                        {/* Description du pack */}
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold font-roboto">
                                PACK DÉCOUVERTE
                            </h1>

                            <p className="text-lg font-inter leading-relaxed">
                                Offrez-vous une <span
                                className="text-packify-pink font-semibold">expérience sur-mesure</span> avec le Pack
                                Découverte.
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
                                        <span
                                            className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                        3 activités au choix parmi une sélection variée
                                    </li>
                                    <li className="flex items-start">
                                        <span
                                            className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                        Des expériences sélectionnées pour leur qualité et leur originalité
                                    </li>
                                    <li className="flex items-start">
                                        <span
                                            className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                                        Une aventure personnalisée pour sortir de votre routine quotidienne
                                    </li>
                                </ul>
                            </div>
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
                            <div
                                className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
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
                            <div
                                className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
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
                            <div
                                className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
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
            <section className="bg-packify-black text-white py-20 px-4"></section>
        </div>
);
}