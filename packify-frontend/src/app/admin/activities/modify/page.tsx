"use client";
import React, { useState } from 'react';

export default function ActivitiesModify() {
    const [activityData, setActivityData] = useState({
        name: 'KARTING',
        category: 'Aventure',
        address: '5 rue de l\'Horloge',
        city: 'Vitry Sur Seine',
        postalCode: '94400',
        image: 'https://image.com',
        description: 'Découverte'
    });

    const categories = [
        'Aventure',
        'Restaurant',
        'Détente',
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActivityData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        console.log('Activity updated:', activityData);
        // Ici vous ajouteriez la logique de sauvegarde
    };

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Activités
                    </h1>
                    <p className="text-packify-pink font-semibold mt-4 text-lg">
                        MODIFIER
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Name and Category */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white font-medium mb-3 text-lg">
                                Nom
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={activityData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-3 text-lg">
                                Mot Clé
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={activityData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-black border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white appearance-none cursor-pointer"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category} className="bg-black text-white">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-white font-medium mb-3 text-lg">
                            Adresse
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={activityData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                        />
                    </div>

                    {/* City and Postal Code */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white font-medium mb-3 text-lg">
                                Ville
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={activityData.city}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-3 text-lg">
                                Code Postal
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                value={activityData.postalCode}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-white font-medium mb-3 text-lg">
                            Image
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={activityData.image}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                            placeholder="https://image.com"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-white font-medium mb-3 text-lg">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={activityData.description}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white resize-none"
                            placeholder="Décrivez l'activité..."
                        />
                    </div>

                    {/* Save Button */}
                    <div className="pt-6">
                        <button
                            onClick={handleSave}
                            className="w-full bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 text-lg"
                        >
                            ENREGISTRER
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}