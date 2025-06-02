"use client";
import React, { useState } from 'react';

export default function Cart() {
    // Activités sélectionnées (récupérées depuis la page précédente)
    const [selectedActivities, setSelectedActivities] = useState([
        {
            id: 1,
            name: "Bloomy Spinach",
            category: "RESTAURANT",
            location: "75006 PARIS",
            description: "Savourez une expérience culinaire d'exception avec un menu créé par le chef Laurent Dubois, reconnu pour sa cuisine créative mêlant tradition française et influences méditerranéennes."
        },
        {
            id: 2,
            name: "Au Milieu des Bulles",
            category: "RESTAURANT",
            location: "75007 PARIS",
            description: "Un brunch copieux et raffiné dans un cadre bohème. Au menu: œufs bénédicte, pancakes aux fruits rouges, sélection de fromages affinés, viennoiseries maison et boissons chaudes à volonté."
        },
        {
            id: 3,
            name: "L'Heure Anglaise",
            category: "AVENTURE",
            location: "75006 PARIS",
            description: "Dégustation de thés grands crus accompagnés de pâtisseries fines. Une sélection de 20 thés rares du monde entier et un assortiment de mignardises préparées par Marie Chevalier, Meilleure Ouvrière de France."
        }
    ]);

    const packPrice = 69;

    // Fonction pour retirer une activité
    const removeActivity = (activityId) => {
        setSelectedActivities(prev => prev.filter(activity => activity.id !== activityId));
    };

    // Calculer le prix (si moins de 3 activités, on garde le même prix pour l'exemple)
    const currentPrice = selectedActivities.length > 0 ? packPrice : 0;

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Mon panier
                    </h1>
                </div>

                {/* Contenu conditionnel selon l'état du panier */}
                {selectedActivities.length > 0 ? (
                    <>
                        {/* Pack Info */}
                        <div className="mb-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold font-roboto">Pack Découverte</h2>
                                    <p className="text-gray-400">{selectedActivities.length} activité{selectedActivities.length > 1 ? 's' : ''} incluse{selectedActivities.length > 1 ? 's' : ''}</p>
                                </div>
                                <div className="text-3xl font-bold">
                                    {currentPrice}€
                                </div>
                            </div>
                        </div>

                        {/* Selected Activities */}
                        <div className="space-y-4 mb-8">
                            {selectedActivities.map((activity, index) => (
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
                                            activity.category === 'RESTAURANT' ? 'bg-orange-500 text-white' :
                                                activity.category === 'AVENTURE' ? 'bg-purple-500 text-white' :
                                                    activity.category === 'ACTIVITÉ' ? 'bg-blue-500 text-white' :
                                                        'bg-orange-500 text-white'
                                        }`}>
                                            {activity.category}
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
                                {currentPrice}€
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button
                            className="w-full bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105">
                            PAYER
                        </button>
                    </>
                ) : (
                    /* État panier vide - Design de la maquette */
                    <div className="flex flex-col items-center justify-center py-24">
                        {/* Icône panier */}
                        <div className="mb-8">
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z"/>
                            </svg>
                        </div>

                        {/* Texte */}
                        <h3 className="text-xl font-bold mb-8 text-center font-roboto">
                            VOTRE PANIER EST VIDE
                        </h3>

                        {/* Bouton */}
                        <button
                            className="bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                            FERMER
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}