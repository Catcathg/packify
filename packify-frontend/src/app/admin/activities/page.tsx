"use client";
import React, { useState } from 'react';

export default function Activities() {
    const [currentPage, setCurrentPage] = useState(1);
    const activitiesPerPage = 5;

    const activities = [
        {
            id: 1,
            name: "SPA PARIS",
            address: "11 Rue Volta",
            city: "Paris",
            postalCode: "75011",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "DÉTENTE"
        },
        {
            id: 2,
            name: "ROYAL CHINA",
            address: "25 rue Turenme",
            city: "Ivry sur Seine",
            postalCode: "94540",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "RESTAURANT"
        },
        {
            id: 3,
            name: "PEDRA ALTA",
            address: "21 Rue Auber",
            city: "Paris",
            postalCode: "75012",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "RESTAURANT"
        },
        {
            id: 4,
            name: "KARTING",
            address: "8 rue de Choisy",
            city: "Vitry sur Seine",
            postalCode: "94400",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "AVENTURE"
        },
        {
            id: 5,
            name: "POULET MASTER",
            address: "9 rue de Malakoff",
            city: "Paris",
            postalCode: "75008",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "RESTAURANT"
        },
        {
            id: 6,
            name: "ESCALADE",
            address: "5 rue de l'Horloge",
            city: "Choisy le Roi",
            postalCode: "94370",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "AVENTURE"
        },
        {
            id: 7,
            name: "ESCALADE",
            address: "5 rue de l'Horloge",
            city: "Choisy le Roi",
            postalCode: "94370",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "AVENTURE"
        },
        {
            id: 8,
            name: "ESCALADE",
            address: "5 rue de l'Horloge",
            city: "Choisy le Roi",
            postalCode: "94370",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "AVENTURE"
        },
        {
            id: 9,
            name: "ESCALADE",
            address: "5 rue de l'Horloge",
            city: "Choisy le Roi",
            postalCode: "94370",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "AVENTURE"
        },
        {
            id: 10,
            name: "ESCALADE",
            address: "5 rue de l'Horloge",
            city: "Choisy le Roi",
            postalCode: "94370",
            image: "https://cdntour-image.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            category: "AVENTURE"
        }
    ];

    const getCategoryColor = (category) => {
        const colors = {
            'RESTAURANT': 'bg-packify-pink text-white',
            'AVENTURE': 'bg-purple-500 text-white',
            'DÉTENTE': 'bg-blue-500 text-white',
            'CULTURE': 'bg-green-500 text-white'
        };
        return colors[category] || 'bg-gray-500 text-white';
    };

    const handleEdit = (id) => {
        console.log('Edit activity:', id);
        // Logique de modification
    };

    const handleDelete = (id) => {
        console.log('Delete activity:', id);
        // Logique de suppression
    };

    const handleCreate = () => {
        console.log('Create new activity');
        // Logique de création
    };

    // Pagination
    const totalPages = Math.ceil(activities.length / activitiesPerPage);
    const startIndex = (currentPage - 1) * activitiesPerPage;
    const currentActivities = activities.slice(startIndex, startIndex + activitiesPerPage);

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-7xl mx-auto px-4 py-8">
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
                        {currentActivities.map((activity) => (
                            <div key={activity.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800 transition-colors items-center">
                                <div className="col-span-1 text-sm font-medium">{activity.id}</div>
                                <div className="col-span-2 font-semibold text-sm">{activity.name}</div>
                                <div className="col-span-2 text-sm text-gray-300">{activity.address}</div>
                                <div className="col-span-1 text-sm text-gray-300">{activity.city}</div>
                                <div className="col-span-1 text-sm text-gray-300">{activity.postalCode}</div>
                                <div className="col-span-1 text-xs text-blue-400 truncate">{activity.image}</div>
                                <div className="col-span-2 text-xs text-gray-400 truncate">{activity.description}</div>
                                <div className="col-span-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                                        {activity.category}
                                    </span>
                                </div>
                                <div className="col-span-1 flex flex-col space-y-1">
                                    <button
                                        onClick={() => handleEdit(activity.id)}
                                        className="text-packify-pink hover:text-white text-xs font-medium underline transition-colors text-left"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(activity.id)}
                                        className="text-red-400 hover:text-red-300 text-xs font-medium underline transition-colors text-left"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
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

                {/* Stats Summary */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">{activities.length}</div>
                        <div className="text-gray-400">Total activités</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">
                            {activities.filter(a => a.category === 'RESTAURANT').length}
                        </div>
                        <div className="text-gray-400">Restaurants</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">
                            {activities.filter(a => a.category === 'AVENTURE').length}
                        </div>
                        <div className="text-gray-400">Aventures</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">
                            {activities.filter(a => a.category === 'DÉTENTE').length}
                        </div>
                        <div className="text-gray-400">Détente</div>
                    </div>
                </div>
            </div>
        </div>
    );
}