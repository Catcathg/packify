"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function ActivitiesModify() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activityId = searchParams.get('id');

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
    const [packs, setPacks] = useState<TypePack[]>([]);
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

                try {
                    const categoriesData = await apiCall('/api/v1/motcle/getAll');
                    setCategories(categoriesData);
                    const packsData = await apiCall('/api/v1/typepack/getAll');
                    setPacks(packsData);
                } catch (err) {
                    console.warn('Erreur lors du chargement des catégories ou packs:', err);
                }

                if (activityId) {
                    try {
                        const activity = await apiCall(`/api/v1/activities/findById?id=${activityId}`);
                        setActivityData({
                            nom: activity.nom || '',
                            idMotCle: activity.motCle?.idMotCle || 0,
                            idTypePack: activity.typePack?.idTypePack || 0,
                            adresse: activity.adresse || '',
                            ville: activity.ville || '',
                            codePostal: activity.codePostal || '',
                            img: activity.img || '',
                            description: activity.description || ''
                        });
                    } catch (err) {
                        console.error('Erreur lors du chargement de l\'activité:', err);
                        setError('Impossible de charger l\'activité à modifier');
                    }
                }

            } catch (err) {
                setError('Erreur de connexion au serveur');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activityId]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setActivityData(prev => ({
            ...prev,
            [name]: name === 'idMotCle' || name === 'idTypePack' ? parseInt(value) : value
        }));

        if (successMessage) setSuccessMessage(null);
        if (error) setError(null);
    };

    const handleSave = async (): Promise<void> => {
        try {
            setSaving(true);
            setSuccessMessage(null);
            setError(null);

            if (!activityData.nom.trim() || !activityData.idMotCle || !activityData.idTypePack || !activityData.adresse.trim() || !activityData.ville.trim()) {
                setError("Tous les champs obligatoires doivent être remplis");
                return;
            }

            if (!activityId) {
                setError("ID de l'activité manquant");
                return;
            }

            const payload = {
                idActivities: parseInt(activityId),
                motCle: { idMotCle: activityData.idMotCle },
                typePack: { idTypePack: activityData.idTypePack },
                nom: activityData.nom.trim(),
                adresse: activityData.adresse.trim(),
                ville: activityData.ville.trim(),
                codePostal: activityData.codePostal.trim(),
                img: activityData.img.trim(),
                description: activityData.description.trim()
            };

            const response = await fetch(`http://localhost:8080/api/v1/activities/update/${activityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(typeof window !== 'undefined' && localStorage.getItem('token') && {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    })
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Erreur HTTP ${response.status}: ${text}`);
            }

            setSuccessMessage(`Activité mise à jour avec succès !`);
            setTimeout(() => router.push('/admin/activities'), 1000);
        } catch (error) {
            console.error('Erreur:', error);
            setSuccessMessage(null);
            setError("Erreur lors de la mise à jour de l'activité");
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-packify-pink mx-auto mb-4"></div>
                    <p>Chargement de l'activité...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Activités
                    </h1>
                    <p className="text-packify-pink font-semibold mt-4 text-lg">
                        MODIFIER L'ACTIVITÉ : {activityData.nom || `#${activityId}`}
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
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span className="text-green-400 font-semibold">{successMessage}</span>
                        </div>
                    </div>
                )}

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
                                        <option key={category.idMotCle} value={category.idMotCle}
                                                className="bg-black text-white">
                                            {category.nom}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 9l-7 7-7-7"/>
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
                                    <div
                                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    MISE À JOUR...
                                </div>
                            ) : (
                                'ENREGISTRER'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}