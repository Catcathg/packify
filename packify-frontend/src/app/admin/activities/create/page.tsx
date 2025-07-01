"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface MotCle {
    idMotCle: number;
    nom: string;
}

interface TypePack {
    idTypePack: number;
    nom: string;
}

interface ActivityData {
    nom: string;
    idMotCle: number;
    idTypePack: number;
    adresse: string;
    ville: string;
    codePostal: string;
    img: string;
    description: string;
}

export default function ActivitiesCreate() {
    const router = useRouter();

    const [activityData, setActivityData] = useState<ActivityData>({
        nom: '',
        idMotCle: 0,
        idTypePack: 0,
        adresse: '',
        ville: '',
        codePostal: '',
        img: '',
        description: ''
    });

    const [categories, setCategories] = useState<MotCle[]>([]);
    const [typePacks, setTypePacks] = useState<TypePack[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

        const fullUrl = `http://localhost:8080${endpoint}`;

        try {
            const response = await fetch(fullUrl, finalOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Récupérer les catégories et typePacks en parallèle
                const [categoriesData, typePacksData] = await Promise.all([
                    apiCall('/api/v1/motcle/getAll'),
                    apiCall('/api/v1/typePacks/getAll')
                ]);

                setCategories(categoriesData);
                setTypePacks(typePacksData);

            } catch (err) {
                console.error('Erreur lors du chargement des données:', err);
                setError('Erreur de connexion au serveur');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setActivityData(prev => ({
            ...prev,
            [name]: (name === 'idMotCle' || name === 'idTypePack') ? parseInt(value) : value
        }));

        if (successMessage) setSuccessMessage(null);
        if (error) setError(null);
    };

    const handleSave = async (): Promise<void> => {
        try {
            setSaving(true);
            setSuccessMessage(null);
            setError(null);

            // Validation
            if (!activityData.nom.trim()) {
                setError("Le nom de l'activité est requis");
                return;
            }
            if (!activityData.idMotCle) {
                setError("Veuillez sélectionner une catégorie");
                return;
            }
            if (!activityData.idTypePack) {
                setError("Veuillez sélectionner un type de pack");
                return;
            }
            if (!activityData.adresse.trim()) {
                setError("L'adresse est requise");
                return;
            }
            if (!activityData.ville.trim()) {
                setError("La ville est requise");
                return;
            }

            const selectedCategory = categories.find(cat => cat.idMotCle === activityData.idMotCle);
            const selectedTypePack = typePacks.find(tp => tp.idTypePack === activityData.idTypePack);

            if (!selectedCategory) {
                setError("Catégorie invalide sélectionnée");
                return;
            }
            if (!selectedTypePack) {
                setError("Type de pack invalide sélectionné");
                return;
            }

            const payload = {
                nom: activityData.nom.trim(),
                adresse: activityData.adresse.trim(),
                ville: activityData.ville.trim(),
                codePostal: activityData.codePostal.trim() || "00000",
                img: activityData.img.trim() || "https://via.placeholder.com/300",
                description: activityData.description.trim() || "Aucune description",
                motCle: {
                    idMotCle: selectedCategory.idMotCle,
                    nom: selectedCategory.nom
                },
                typePack: {
                    idTypePack: selectedTypePack.idTypePack,
                    nom: selectedTypePack.nom
                }
            };

            console.log('Payload envoyé:', payload);

            const result = await apiCall('/api/v1/activities/save', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            console.log('Activité créée avec succès:', result);
            setSuccessMessage(`Activité créée avec succès ! (${new Date().toLocaleTimeString()})`);

            setTimeout(() => {
                router.push('/admin/activities');
            }, 2000);

        } catch (error) {
            console.error('Erreur:', error);
            setError(`Erreur: ${(error as Error).message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = (): void => {
        setActivityData({
            nom: '',
            idMotCle: 0,
            idTypePack: 0,
            adresse: '',
            ville: '',
            codePostal: '',
            img: '',
            description: ''
        });
        setSuccessMessage(null);
        setError(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-packify-pink mx-auto mb-4"></div>
                    <p>Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Activités
                    </h1>
                    <p className="text-packify-pink font-semibold mt-4 text-lg">
                        CRÉER UNE NOUVELLE ACTIVITÉ
                    </p>
                </div>

                {/* Messages d'erreur/succès */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01"/>
                            </svg>
                            <span className="text-red-400 font-semibold">{error}</span>
                        </div>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span className="text-green-400 font-semibold">{successMessage}</span>
                        </div>
                        <p className="text-green-300 text-sm mt-2">
                            Redirection vers la liste des activités dans quelques secondes...
                        </p>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                    {/* Name, Category and TypePack */}
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-white font-medium mb-3 text-lg">
                                Nom
                            </label>
                            <input
                                type="text"
                                name="nom"
                                value={activityData.nom}
                                onChange={handleInputChange}
                                disabled={saving}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white disabled:opacity-50"
                                placeholder="Nom de l'activité"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-3 text-lg">
                                Catégorie
                            </label>
                            <div className="relative">
                                <select
                                    name="idMotCle"
                                    value={activityData.idMotCle}
                                    onChange={handleInputChange}
                                    disabled={saving}
                                    className="w-full px-4 py-3 bg-black border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value={0}>Sélectionner une catégorie</option>
                                    {categories.map(category => (
                                        <option key={category.idMotCle} value={category.idMotCle} className="bg-black text-white">
                                            {category.nom}
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
                        <div>
                            <label className="block text-white font-medium mb-3 text-lg">
                                Type de Pack
                            </label>
                            <div className="relative">
                                <select
                                    name="idTypePack"
                                    value={activityData.idTypePack}
                                    onChange={handleInputChange}
                                    disabled={saving}
                                    className="w-full px-4 py-3 bg-black border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value={0}>Sélectionner un type</option>
                                    {typePacks.map(typePack => (
                                        <option key={typePack.idTypePack} value={typePack.idTypePack} className="bg-black text-white">
                                            {typePack.nom}
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
                            name="adresse"
                            value={activityData.adresse}
                            onChange={handleInputChange}
                            disabled={saving}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white disabled:opacity-50"
                            placeholder="Adresse complète"
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
                                name="ville"
                                value={activityData.ville}
                                onChange={handleInputChange}
                                disabled={saving}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white disabled:opacity-50"
                                placeholder="Ville"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-3 text-lg">
                                Code Postal
                            </label>
                            <input
                                type="text"
                                name="codePostal"
                                value={activityData.codePostal}
                                onChange={handleInputChange}
                                disabled={saving}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white disabled:opacity-50"
                                placeholder="75001"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-white font-medium mb-3 text-lg">
                            Image (URL)
                        </label>
                        <input
                            type="url"
                            name="img"
                            value={activityData.img}
                            onChange={handleInputChange}
                            disabled={saving}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white disabled:opacity-50"
                            placeholder="https://exemple.com/image.jpg"
                        />
                        {/* Aperçu de l'image */}
                        {activityData.img && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-400 mb-2">Aperçu :</p>
                                <img
                                    src={activityData.img}
                                    alt="Aperçu"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
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
                            disabled={saving}
                            rows={6}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all text-white resize-none disabled:opacity-50"
                            placeholder="Décrivez l'activité..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button
                            onClick={handleReset}
                            disabled={saving}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 disabled:opacity-50"
                        >
                            RÉINITIALISER
                        </button>
                        <button
                            onClick={() => router.back()}
                            disabled={saving}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 disabled:opacity-50"
                        >
                            ANNULER
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 text-lg disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    CRÉATION...
                                </div>
                            ) : (
                                'CRÉER'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}