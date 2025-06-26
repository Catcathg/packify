"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MotCle {
    idMotCle: number;
    nom: string;
}

interface Activity {
    id: number;
    name: string;
    location: string;
    category: string;
    categoryLabel?: string;
    image: string;
    description: string;
}

interface CartItem {
    id: number;
    name: string;
    location: string;
    category: string;
    image: string;
    description: string;
}

export default function Activities() {
    const router = useRouter();
    const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [categories, setCategories] = useState<MotCle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction utilitaire pour les appels API
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
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    };

    // Récupérer les activités et catégories depuis l'API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Récupérer les catégories
                let categoriesData: MotCle[] = [];
                try {
                    categoriesData = await apiCall('/api/v1/motcle/getAll');
                } catch (err) {
                    console.warn('Impossible de charger les catégories depuis l\'API:', err);
                    setError('Erreur de chargement des catégories');
                }

                // Récupérer les activités
                let activitiesData: Activity[] = [];
                try {
                    const rawActivitiesData = await apiCall('/api/v1/activities/getAll');

                    // Vérifier si on a bien reçu un tableau
                    if (!Array.isArray(rawActivitiesData)) {
                        throw new Error('Les données reçues ne sont pas un tableau');
                    }

                    if (rawActivitiesData.length === 0) {
                        setError('Aucune activité trouvée dans la base de données');
                    }

                    // Mapper les données backend vers le format frontend
                    activitiesData = rawActivitiesData.map((activity: any, index: number) => {
                        const mapped: Activity = {
                            id: activity.idActivities || index + 1,
                            name: activity.nom || 'Nom manquant',
                            location: activity.adresse && activity.codePostal && activity.ville
                                ? `${activity.adresse}, ${activity.codePostal} ${activity.ville}`
                                : 'Localisation manquante',
                            category: activity.motCle?.idMotCle?.toString() || activity.idMotCle?.toString() || '1',
                            categoryLabel: activity.motCle?.nom || 'Catégorie inconnue',
                            image: activity.img || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop",
                            description: activity.description || 'Description manquante'
                        };

                        return mapped;
                    });

                } catch (err) {
                    console.warn('Impossible de charger les activités depuis l\'API:', err);
                    setError('Erreur de chargement des activités: ' + (err as Error).message);
                }

                // Mettre à jour les states
                setCategories(categoriesData);
                setActivities(activitiesData);

                if (activitiesData.length === 0) {
                    setError('Aucune activité n\'a pu être chargée depuis la base de données');
                }

            } catch (err) {
                setError('Erreur de connexion au serveur: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Récupérer le panier depuis localStorage
    useEffect(() => {
        const loadCartFromStorage = () => {
            try {
                if (typeof window !== 'undefined') {
                    const savedCart = localStorage.getItem('cart');
                    if (savedCart) {
                        const cartData = JSON.parse(savedCart);
                        setCartItems(cartData || []);
                    } else {
                        setCartItems([]);
                    }
                }
            } catch (err) {
                console.warn('Erreur lors du chargement du panier depuis localStorage:', err);
                setCartItems([]);
            }
        };

        loadCartFromStorage();

        // Écouter les changements de localStorage (synchronisation entre onglets)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart') {
                loadCartFromStorage();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    // Fonction pour sauvegarder le panier dans localStorage
    const saveCartToStorage = (items: CartItem[]) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(items));
            }
        } catch (err) {
            console.error('Erreur lors de la sauvegarde du panier:', err);
        }
    };

    // Fonction pour supprimer une activité du panier
    const removeFromCart = (activityId: number) => {
        const updatedCartItems = cartItems.filter(item => item.id !== activityId);
        setCartItems(updatedCartItems);
        saveCartToStorage(updatedCartItems);
    };

    // Calculer combien d'activités il reste à sélectionner
    const cartCount = cartItems.length;
    const remainingSlots = 3 - cartCount;
    const maxSelectable = remainingSlots;

    // Vérifier si une activité est dans le panier
    const isInCart = (activityId: number): boolean => {
        return cartItems.some(item => item.id === activityId);
    };

    // Trouver le mot-clé correspondant à une catégorie
    const getCategoryById = (categoryId: string): MotCle | undefined => {
        return categories.find(cat => cat.idMotCle.toString() === categoryId || cat.nom === categoryId);
    };

    const handleActivitySelect = (activityId: number) => {
        if (selectedActivities.includes(activityId)) {
            // Désélectionner l'activité
            setSelectedActivities(selectedActivities.filter(id => id !== activityId));
        } else if (selectedActivities.length < maxSelectable) {
            // Sélectionner l'activité
            setSelectedActivities([...selectedActivities, activityId]);
        }
    };

    // Fonction pour valider la sélection et ajouter au panier
    const handleValidateSelection = async () => {
        try {
            // Récupérer les activités sélectionnées avec leurs détails complets
            const selectedActivityDetails = activities.filter(activity =>
                selectedActivities.includes(activity.id)
            );

            // Ajouter chaque activité au panier local
            const newCartItems = selectedActivityDetails.filter(activity => !isInCart(activity.id));
            const updatedCartItems = [...cartItems, ...newCartItems];

            // Mettre à jour le state et localStorage
            setCartItems(updatedCartItems);
            saveCartToStorage(updatedCartItems);

            // Réinitialiser la sélection locale
            setSelectedActivities([]);

            // Rediriger vers le panier seulement si le pack devient complet
            const willBeComplete = cartCount + selectedActivities.length >= 3;
            if (willBeComplete) {
                router.push('/cart');
            } else {
                // Pack pas encore complet, afficher un message de confirmation
                alert(`✅ ${selectedActivities.length} activité${selectedActivities.length > 1 ? 's' : ''} ajoutée${selectedActivities.length > 1 ? 's' : ''} au panier ! Il vous en manque encore ${3 - (cartCount + selectedActivities.length)} pour compléter votre pack.`);
            }
        } catch (err) {
            console.error('Erreur lors de l\'ajout au panier:', err);
            alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
        }
    };

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || activity.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category: string) => {
        // Couleurs par défaut basées sur le nom du mot-clé
        const defaultColors: { [key: string]: string } = {
            'RESTAURANT': 'bg-packify-pink',
            'AVENTURE': 'bg-purple-500',
            'DÉTENTE': 'bg-blue-500',
        };

        const categoryObj = getCategoryById(category);
        const categoryName = categoryObj?.nom || category;

        return defaultColors[categoryName.toUpperCase()] || 'bg-gray-500';
    };

    // États de chargement et d'erreur
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-packify-pink mx-auto mb-4"></div>
                    <p className="text-xl">Chargement des activités...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Affichage d'erreur en haut si présente */}
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4 font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Personnalisez votre Pack
                    </h1>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300">Votre pack :</span>
                            <span className="text-sm font-bold">{cartCount + selectedActivities.length}/3</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-packify-pink h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((cartCount + selectedActivities.length) / 3) * 100}%` }}
                            ></div>
                        </div>
                        {cartCount > 0 && (
                            <div className="mt-2">
                                <p className="text-blue-400 text-sm">
                                    {cartCount} activité{cartCount > 1 ? 's' : ''} déjà dans votre panier
                                </p>
                                {/* Afficher les activités dans le panier avec possibilité de suppression */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                                            <span>{item.name}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="hover:bg-green-700 rounded-full p-0.5 transition-colors"
                                                title="Retirer du panier"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {remainingSlots > 0 && selectedActivities.length === 0 && (
                            <p className="text-yellow-400 text-sm mt-2">
                                Sélectionnez encore {remainingSlots} activité{remainingSlots > 1 ? 's' : ''} pour compléter votre pack
                            </p>
                        )}
                        {selectedActivities.length > 0 && (
                            <div className="mt-2">
                                <p className="text-packify-pink text-sm font-medium">
                                    {selectedActivities.length} activité{selectedActivities.length > 1 ? 's' : ''} sélectionnée{selectedActivities.length > 1 ? 's' : ''} - Validez pour ajouter au panier
                                </p>
                                {/* Afficher les activités sélectionnées avec possibilité de désélection */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedActivities.map(activityId => {
                                        const activity = activities.find(a => a.id === activityId);
                                        return activity ? (
                                            <div key={activityId} className="bg-packify-pink text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                                                <span>{activity.name}</span>
                                                <button
                                                    onClick={() => handleActivitySelect(activityId)}
                                                    className="hover:bg-pink-600 rounded-full p-0.5 transition-colors"
                                                    title="Désélectionner"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                        {cartCount + selectedActivities.length === 3 && (
                            <p className="text-green-400 text-sm mt-2 font-bold">
                                Pack complet ! Prêt pour la finalisation
                            </p>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Nom d'une expérience, cuisine, lieu, catégorie..."
                            className="w-full bg-white text-black px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-packify-pink"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                                selectedCategory === ''
                                    ? 'bg-packify-pink text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Tous
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.idMotCle}
                                onClick={() => setSelectedCategory(category.idMotCle.toString())}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${
                                    selectedCategory === category.idMotCle.toString()
                                        ? 'bg-packify-pink text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {category.nom}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <p className="text-gray-400 mb-8">{filteredActivities.length} résultats</p>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredActivities.map(activity => {
                        const isSelected = selectedActivities.includes(activity.id);
                        const isAlreadyInCart = isInCart(activity.id);
                        const canSelect = selectedActivities.length < maxSelectable || isSelected;

                        return (
                            <div
                                key={activity.id}
                                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                                    isSelected
                                        ? 'ring-4 ring-packify-pink transform scale-105'
                                        : isAlreadyInCart
                                            ? 'ring-2 ring-green-500 opacity-75'
                                            : canSelect
                                                ? 'hover:transform hover:scale-105 hover:shadow-lg'
                                                : 'opacity-50 cursor-not-allowed'
                                }`}
                                onClick={() => canSelect && !isAlreadyInCart && handleActivitySelect(activity.id)}
                            >
                                {/* Category Badge */}
                                <div className="relative">
                                    <div className={`absolute top-4 left-4 ${getCategoryColor(activity.category)} text-white px-3 py-1 rounded-full text-sm font-medium z-10`}>
                                        {getCategoryById(activity.category)?.nom || activity.categoryLabel || activity.category}
                                    </div>

                                    {/* Already in cart badge */}
                                    {isAlreadyInCart && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                                            ✓ Dans le panier
                                        </div>
                                    )}

                                    {/* Image */}
                                    {activity.image ? (
                                        <img
                                            src={activity.image}
                                            alt={activity.name}
                                            className="h-48 w-full object-cover"
                                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop";
                                            }}
                                        />
                                    ) : (
                                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">Image à venir</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 text-black">
                                    <h3 className="font-bold text-lg mb-2 font-roboto">{activity.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{activity.location}</p>
                                    <p className="text-gray-700 text-xs mb-4 line-clamp-2">{activity.description}</p>

                                    {/* Buttons */}
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
                                            DÉTAILS
                                        </button>
                                        <button
                                            disabled={isAlreadyInCart || (!canSelect && !isSelected)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (canSelect && !isAlreadyInCart) {
                                                    handleActivitySelect(activity.id);
                                                }
                                            }}
                                            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                                                isAlreadyInCart
                                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                                    : isSelected
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : canSelect
                                                            ? 'bg-packify-pink text-white hover:bg-packify-pink-light'
                                                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            }`}
                                        >
                                            {isAlreadyInCart
                                                ? 'DÉJÀ AJOUTÉ'
                                                : isSelected
                                                    ? 'SUPPRIMER'
                                                    : 'SÉLECTIONNER'
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Message si aucune activité trouvée */}
                {filteredActivities.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">Aucune activité trouvée.</p>
                        <p className="text-gray-500 text-sm mt-2">
                            {activities.length === 0
                                ? "Aucune activité n'est disponible dans la base de données."
                                : "Essayez de modifier vos critères de recherche."
                            }
                        </p>
                    </div>
                )}

                {/* Validation Button - S'affiche dès qu'il y a une sélection */}
                {selectedActivities.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                        <button
                            onClick={handleValidateSelection}
                            className="bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z"/>
                            </svg>
                            <span>
                                {selectedActivities.length === 1
                                    ? "AJOUTER AU PANIER (1)"
                                    : `AJOUTER AU PANIER (${selectedActivities.length})`
                                }
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}