"use client";
import React, { useState } from 'react';

export default function Activities() {
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Données des activités
    const activities = [
        {
            id: 1,
            name: "Au Milieu des Bulles",
            location: "75007 PARIS",
            category: "RESTAURANT",
            image: "/api/placeholder/300/200"
        },
        {
            id: 2,
            name: "Les Feuilles d'Or",
            location: "75001 PARIS",
            category: "AVENTURE",
            image: "/api/placeholder/300/200"
        },
        {
            id: 3,
            name: "Bloomy Spinach",
            location: "75006 PARIS",
            category: "RESTAURANT",
            image: "/api/placeholder/300/200"
        },
        {
            id: 4,
            name: "L'Heure Anglaise",
            location: "75006 PARIS",
            category: "AVENTURE",
            image: "/api/placeholder/300/200"
        },
        {
            id: 5,
            name: "L'Écrin des Saveurs",
            location: "75008 PARIS",
            category: "AVENTURE",
            image: "/api/placeholder/300/200"
        },
        {
            id: 6,
            name: "La Rose des Vents",
            location: "75018 PARIS",
            category: "ACTIVITÉ",
            image: "/api/placeholder/300/200"
        },
        {
            id: 7,
            name: "La Symphonie Gourmande",
            location: "75008 PARIS",
            category: "RESTAURANT",
            image: "/api/placeholder/300/200"
        },
        {
            id: 8,
            name: "L'Atelier de Jean",
            location: "75011 PARIS",
            category: "RESTAURANT",
            image: "/api/placeholder/300/200"
        },
        {
            id: 9,
            name: "La Théière Enchantée",
            location: "75008 PARIS",
            category: "RESTAURANT",
            image: "/api/placeholder/300/200"
        },
        {
            id: 10,
            name: "Le Pain Quotidien",
            location: "75002 PARIS",
            category: "RESTAURANT",
            image: "/api/placeholder/300/200"
        },
        {
            id: 11,
            name: "Le Jardin Secret",
            location: "75007 PARIS",
            category: "RESTAURANT",
            image: "/api/placeholder/300/200"
        },
        {
            id: 12,
            name: "Les Délices",
            location: "75011 PARIS",
            category: "RESTAURANT",
            image: "/api/placeholder/300/200"
        }
    ];

    const categories = ['RESTAURANT', 'AVENTURE', 'ACTIVITÉ'];

    const handleActivitySelect = (activityId) => {
        if (selectedActivities.includes(activityId)) {
            setSelectedActivities(selectedActivities.filter(id => id !== activityId));
        } else if (selectedActivities.length < 3) {
            setSelectedActivities([...selectedActivities, activityId]);
        }
    };

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || activity.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category) => {
        const colors = {
            'RESTAURANT': 'bg-packify-pink',
            'AVENTURE': 'bg-purple-500',
            'ACTIVITÉ': 'bg-blue-500',
        };
        return colors[category] || 'bg-gray-500';
    };

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4 font-roboto border-b-2 border-packify-pink pb-2 inline-block">Personnalisez votre Pack</h1>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300">Votre sélection :</span>
                            <span className="text-sm font-bold">{selectedActivities.length}/3</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-packify-pink h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(selectedActivities.length / 3) * 100}%` }}
                            ></div>
                        </div>
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
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${
                                    selectedCategory === category
                                        ? 'bg-packify-pink text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {category}
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
                        const canSelect = selectedActivities.length < 3 || isSelected;

                        return (
                            <div
                                key={activity.id}
                                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                                    isSelected
                                        ? 'ring-4 ring-packify-pink transform scale-105'
                                        : canSelect
                                            ? 'hover:transform hover:scale-105 hover:shadow-lg'
                                            : 'opacity-50 cursor-not-allowed'
                                }`}
                                onClick={() => canSelect && handleActivitySelect(activity.id)}
                            >
                                {/* Category Badge */}
                                <div className="relative">
                                    <div className={`absolute top-4 left-4 ${getCategoryColor(activity.category)} text-white px-3 py-1 rounded-full text-sm font-medium z-10`}>
                                        {activity.category}
                                    </div>

                                    {/* Image Placeholder */}
                                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">Image à venir</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 text-black">
                                    <h3 className="font-bold text-lg mb-2 font-roboto">{activity.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{activity.location}</p>

                                    {/* Buttons */}
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
                                            DÉTAILS
                                        </button>
                                        <button
                                            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                                                isSelected
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-packify-pink text-white hover:bg-packify-pink-light'
                                            }`}
                                        >
                                            {isSelected ? 'SUPPRIMER' : 'SÉLECTIONNER'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                <div className="flex justify-center space-x-3">
                    <button className="w-4 h-4 bg-packify-pink rounded-full"></button>
                    <button className="w-4 h-4 bg-gray-600 rounded-full hover:bg-gray-500 transition-colors"></button>
                </div>

                {/* Validation Button */}
                {selectedActivities.length === 3 && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
                        <button className="bg-packify-pink hover:bg-packify-pink-light text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                            VALIDER MA SÉLECTION ({selectedActivities.length}/3)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}