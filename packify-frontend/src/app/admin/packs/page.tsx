"use client";
import React, { useState } from 'react';

export default function Packs() {
    const [packData, setPackData] = useState({
        name: 'Découverte',
        price: '69',
        description: 'Découverte',
        image: 'https://image.com'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPackData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        console.log('Pack updated:', packData);
        // Ici vous ajouteriez la logique de sauvegarde
    };

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Packs
                    </h1>
                    <p className="text-packify-pink font-semibold mt-4 text-lg">
                        MODIFIER
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Name and Price */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white font-medium mb-3">
                                Nom
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={packData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-3">
                                Prix
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={packData.price}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-white font-medium mb-3">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={packData.description}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white resize-none"
                            placeholder="Décrivez votre pack..."
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-white font-medium mb-3">
                            Image
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={packData.image}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white"
                            placeholder="https://image.com"
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