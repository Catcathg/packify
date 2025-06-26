"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';

interface PackData {
    nom: string;
    prix: string;
    description: string;
    img: string;
}

export default function Packs() {
    const [packData, setPackData] = useState<PackData>({
        nom: '',
        prix: '',
        description: '',
        img: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const packId = 1; // ID de ton pack découverte

    useEffect(() => {
        const fetchPack = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/v1/typePacks/findById?id=${packId}`);

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du pack');
                }

                const data = await response.json();
                setPackData({
                    nom: data.nom || '',
                    prix: data.prix?.toString() || '',
                    description: data.description || '',
                    img: data.img || ''
                });
                setError(null);
            } catch (err) {
                console.error('Erreur chargement pack:', err);
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };

        fetchPack();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPackData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                idTypePack: packId,
                nom: packData.nom,
                prix: parseFloat(packData.prix) || 0,
                description: packData.description,
                img: packData.img
            };

            const response = await fetch('http://localhost:8080/api/v1/typePacks/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            const updatedPack = await response.json();
            console.log('Pack mis à jour:', updatedPack);
            alert("✅ Pack mis à jour avec succès !");

        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement:', error);
            alert("❌ Erreur lors de l'enregistrement");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-packify-pink mx-auto mb-4"></div>
                    <p>Chargement du pack...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">❌ {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-packify-pink hover:bg-packify-pink-light text-white px-6 py-2 rounded-full"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Packs
                    </h1>
                    <p className="text-packify-pink font-semibold mt-4 text-lg">MODIFIER</p>
                </div>

                {/* Formulaire */}
                <div className="space-y-6">
                    {/* Champs nom et prix */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white font-medium mb-3">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={packData.nom}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-packify-pink"
                                placeholder="Nom du pack"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-3">Prix (€)</label>
                            <input
                                type="number"
                                name="prix"
                                value={packData.prix}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-packify-pink"
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-white font-medium mb-3">Description</label>
                        <textarea
                            name="description"
                            value={packData.description}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-packify-pink"
                            placeholder="Décrivez votre pack..."
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-white font-medium mb-3">Image (URL)</label>
                        <input
                            type="url"
                            name="img"
                            value={packData.img}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-packify-pink"
                            placeholder="https://exemple.com/image.jpg"
                        />
                        {packData.img && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-400 mb-2">Aperçu :</p>
                                <img
                                    src={packData.img}
                                    alt="Aperçu"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Bouton enregistrer */}
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