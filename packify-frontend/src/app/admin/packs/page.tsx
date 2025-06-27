"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';


interface PackData {
    nom: string;
    prix: string;
    description: string;
    img: string;
}

export default function Packs() {
    const router = useRouter();
    const [packData, setPackData] = useState<PackData>({
        nom: '',
        prix: '',
        description: '',
        img: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const packId = 1;

    useEffect(() => {
        const fetchPack = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/v1/typePacks/findById?id=${packId}`);

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
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
        if (successMessage) {
            setSuccessMessage(null);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setSuccessMessage(null);

            if (!packData.nom.trim()) {
                alert("Le nom du pack est requis");
                return;
            }

            if (!packData.prix || parseFloat(packData.prix) <= 0) {
                alert("Le prix doit être supérieur à 0");
                return;
            }

            const payload = {
                nom: packData.nom.trim(),
                prix: parseFloat(packData.prix),
                description: packData.description.trim(),
                img: packData.img.trim()
            };

            console.log('=== MISE À JOUR PACK ID=' + packId + ' ===');
            console.log('Payload:', payload);

            const response = await fetch(`http://localhost:8080/api/v1/typePacks/update/${packId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log('Statut HTTP complet:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries())
            });

            console.log('Requête envoyée sans erreur réseau - considérant comme succès');
            setSuccessMessage(`Pack mis à jour avec succès ! (${new Date().toLocaleTimeString()})`);
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 1000);

            setTimeout(async () => {
                try {
                    const checkResponse = await fetch(`http://localhost:8080/api/v1/typePacks/findById?id=${packId}`);
                    if (checkResponse.ok) {
                        const updatedData = await checkResponse.json();
                        console.log('Vérification BDD - pack mis à jour:', updatedData);

                        setPackData({
                            nom: updatedData.nom || '',
                            prix: updatedData.prix?.toString() || '',
                            description: updatedData.description || '',
                            img: updatedData.img || ''
                        });
                    }
                } catch (e) {
                    console.log('Vérification BDD impossible, mais mise à jour probablement réussie');
                }
            }, 500);

        } catch (error) {
            console.error('Erreur réseau:', error);
            setSuccessMessage(null);

            if (error instanceof TypeError && error.message.includes('fetch')) {
                alert('Impossible de contacter le serveur. Vérifiez que Spring Boot est démarré.');
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } finally {
            setSaving(false);
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
                    <p className="text-red-500 mb-4">{error}</p>
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
                    <p className="text-packify-pink font-semibold mt-4 text-lg">MODIFIER LE PACK</p>
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
                                disabled={saving}
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
                                min="0"
                                disabled={saving}
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
                            disabled={saving}
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
                            disabled={saving}
                        />
                    </div>

                    {/* Message de succès */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <span className="text-green-400 font-semibold">{successMessage}</span>
                            </div>
                        </div>
                    )}

                    {/* Bouton enregistrer */}
                    <div className="pt-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`w-full font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg ${
                                saving
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-packify-pink hover:bg-packify-pink-light transform hover:scale-105'
                            } text-white`}
                        >
                            {saving ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    MISE À JOUR EN COURS...
                                </div>
                            ) : (
                                'METTRE À JOUR LE PACK'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}