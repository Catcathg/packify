"use client";
import React, { useState, useEffect } from 'react';
import {useRouter} from "next/navigation";

interface Activity {
    idActivities: number;
    nom: string;
    adresse: string;
    ville: string;
    codePostal: string;
    img: string;
    description: string;
    motCle?: {
        idMotCle: number;
        nom: string;
    };
    idMotCle?: number;
}

interface MotCle {
    idMotCle: number;
    nom: string;
}

export default function Activities() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [categories, setCategories] = useState<MotCle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const activitiesPerPage: number = 5;

    const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`http://localhost:8080${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Erreur ${response.status}: ${message || response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');

        if (contentType?.includes('application/json') && contentLength !== '0') {
            return await response.json();
        }

        return null;
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                let categoriesData: MotCle[] = [];
                try {
                    categoriesData = await apiCall('/api/v1/motcle/getAll');
                    setCategories(categoriesData);
                } catch (err) {
                    console.warn('Impossible de charger les catégories depuis l\'API:', err);
                }

                try {
                    const activitiesData = await apiCall('/api/v1/activities/getAll');

                    if (!Array.isArray(activitiesData)) {
                        throw new Error('Les données reçues ne sont pas un tableau');
                    }

                    setActivities(activitiesData);

                    if (activitiesData.length === 0) {
                        setError('Aucune activité trouvée dans la base de données');
                    }

                } catch (err) {
                    console.error('Erreur lors du chargement des activités:', err);
                    setError('Erreur de chargement des activités: ' + (err as Error).message);
                }

            } catch (err) {
                setError('Erreur de connexion au serveur: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCategoryColor = (activity: Activity): string => {
        const categoryName = activity.motCle?.nom || categories.find(cat => cat.idMotCle === activity.idMotCle)?.nom || 'INCONNU';

        const colors: Record<string, string> = {
            'RESTAURANT': 'bg-packify-pink text-white',
            'AVENTURE': 'bg-purple-500 text-white',
            'DÉTENTE': 'bg-blue-500 text-white',
            'CULTURE': 'bg-green-500 text-white'
        };
        return colors[categoryName.toUpperCase()] || 'bg-gray-500 text-white';
    };

    const getCategoryName = (activity: Activity): string => {
        return activity.motCle?.nom || categories.find(cat => cat.idMotCle === activity.idMotCle)?.nom || 'Inconnu';
    };

    const handleEdit = (id: number): void => {
        console.log('Edit activity:', id);
        router.push(`/admin/activities/modify?id=${id}`);
    };


    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
            return;
        }

        try {
            await apiCall(`/api/v1/activities/delete?id=${id}`, {
                method: 'DELETE'
            });

            setActivities(activities.filter(activity => activity.idActivities !== id));
            alert('Activité supprimée avec succès !');

        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            alert('Erreur lors de la suppression de l\'activité');
        }
    };

    const handleCreate = (): void => {
        console.log('Create new activity');
        router.push('/admin/activities/create');
    };

    const totalPages = Math.ceil(activities.length / activitiesPerPage);
    const startIndex = (currentPage - 1) * activitiesPerPage;
    const currentActivities = activities.slice(startIndex, startIndex + activitiesPerPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-packify-pink mx-auto mb-4"></div>
                    <p>Chargement des activités...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Affichage d'erreur */}
                {error && (
                    <div className="mb-6 bg-red-900/30 border border-red-500 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Activités
                    </h1>
                    <button
                        onClick={handleCreate}
                        className="bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        CRÉER
                    </button>
                </div>

                {/* Table */}
                <div className="bg-packify-navy rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-700 text-packify-pink font-semibold text-sm">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-2">NOM</div>
                        <div className="col-span-2">ADRESSE</div>
                        <div className="col-span-1">VILLE</div>
                        <div className="col-span-1">C.P.</div>
                        <div className="col-span-1">IMAGE</div>
                        <div className="col-span-2">DESCRIPTION</div>
                        <div className="col-span-1">CATÉGORIE</div>
                        <div className="col-span-1">ACTIONS</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-600">
                        {currentActivities.length > 0 ? (
                            currentActivities.map((activity) => (
                                <div key={activity.idActivities} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800 transition-colors items-center">
                                    <div className="col-span-1 text-sm font-medium">{activity.idActivities}</div>
                                    <div className="col-span-2 font-semibold text-sm">{activity.nom}</div>
                                    <div className="col-span-2 text-sm text-gray-300">{activity.adresse}</div>
                                    <div className="col-span-1 text-sm text-gray-300">{activity.ville}</div>
                                    <div className="col-span-1 text-sm text-gray-300">{activity.codePostal}</div>
                                    <div className="col-span-1 text-xs text-blue-400 truncate" title={activity.img}>
                                        {activity.img ? (
                                            <a href={activity.img} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                Voir image
                                            </a>
                                        ) : (
                                            'Aucune image'
                                        )}
                                    </div>
                                    <div className="col-span-2 text-xs text-gray-400" title={activity.description}>
                                        {activity.description ? (
                                            activity.description.length > 50
                                                ? activity.description.substring(0, 50) + '...'
                                                : activity.description
                                        ) : (
                                            'Aucune description'
                                        )}
                                    </div>
                                    <div className="col-span-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity)}`}>
                                            {getCategoryName(activity)}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex flex-col space-y-1">
                                        <button
                                            onClick={() => handleEdit(activity.idActivities)}
                                            className="text-packify-pink hover:text-white text-xs font-medium underline transition-colors text-left"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activity.idActivities)}
                                            className="text-red-400 hover:text-red-300 text-xs font-medium underline transition-colors text-left"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-12 text-center py-8 text-gray-400">
                                {loading ? 'Chargement...' : 'Aucune activité trouvée'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-full font-medium transition-all duration-300 ${
                                    currentPage === page
                                        ? 'bg-packify-pink text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}

                {/* Stats Summary */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">{activities.length}</div>
                        <div className="text-gray-400">Total activités</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">
                            {activities.filter(a => getCategoryName(a).toUpperCase() === 'RESTAURANT').length}
                        </div>
                        <div className="text-gray-400">Restaurants</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">
                            {activities.filter(a => getCategoryName(a).toUpperCase() === 'AVENTURE').length}
                        </div>
                        <div className="text-gray-400">Aventures</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">
                            {activities.filter(a => getCategoryName(a).toUpperCase() === 'DÉTENTE').length}
                        </div>
                        <div className="text-gray-400">Détente</div>
                    </div>
                </div>
            </div>
        </div>
    );
}