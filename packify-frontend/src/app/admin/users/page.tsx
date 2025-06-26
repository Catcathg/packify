"use client";
import React, { useState } from 'react';

interface User {
    idUtilisateur: number;
    email: string;
    nom: string;
    prenom: string;
    role: number;
    commandsCount: number;
}

export default function Users() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const usersPerPage: number = 5;

    const users: User[] = [
        {
            idUtilisateur: 1,
            email: "marie.dupont@email.com",
            nom: "Dupont",
            prenom: "Marie",
            role: 1,
            commandsCount: 3
        },
        {
            idUtilisateur: 2,
            email: "pierre.martin@email.com",
            nom: "Martin",
            prenom: "Pierre",
            role: 1,
            commandsCount: 1
        },
        {
            idUtilisateur: 3,
            email: "admin@packify.com",
            nom: "Admin",
            prenom: "Système",
            role: 2,
            commandsCount: 0
        },
        {
            idUtilisateur: 4,
            email: "sophie.bernard@email.com",
            nom: "Bernard",
            prenom: "Sophie",
            role: 1,
            commandsCount: 5
        },
        {
            idUtilisateur: 5,
            email: "lucas.petit@email.com",
            nom: "Petit",
            prenom: "Lucas",
            role: 1,
            commandsCount: 2
        },
        {
            idUtilisateur: 6,
            email: "camille.rousseau@email.com",
            nom: "Rousseau",
            prenom: "Camille",
            role: 1,
            commandsCount: 4
        },
        {
            idUtilisateur: 7,
            email: "thomas.moreau@email.com",
            nom: "Moreau",
            prenom: "Thomas",
            role: 1,
            commandsCount: 1
        },
        {
            idUtilisateur: 8,
            email: "julie.simon@email.com",
            nom: "Simon",
            prenom: "Julie",
            role: 1,
            commandsCount: 3
        },
        {
            idUtilisateur: 9,
            email: "maxime.laurent@email.com",
            nom: "Laurent",
            prenom: "Maxime",
            role: 1,
            commandsCount: 0
        },
        {
            idUtilisateur: 10,
            email: "emma.michel@email.com",
            nom: "Michel",
            prenom: "Emma",
            role: 1,
            commandsCount: 6
        }
    ];

    const getRoleBadge = (role: number): { text: string; className: string } => {
        switch (role) {
            case 1:
                return { text: 'CLIENT', className: 'bg-blue-500 text-white' };
            case 2:
                return { text: 'ADMIN', className: 'bg-red-500 text-white' };
            default:
                return { text: 'INCONNU', className: 'bg-gray-500 text-white' };
        }
    };

    const handleEdit = (id: number): void => {
        console.log('Edit user:', id);
    };

    const handleDelete = (id: number): void => {
        console.log('Delete user:', id);
    };

    const handleCreate = (): void => {
        console.log('Create new user');
    };

    const handleViewCommands = (id: number): void => {
        console.log('View commands for user:', id);
    };

    // Pagination
    const totalPages = Math.ceil(users.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-pink-500 pb-2 inline-block">
                        Utilisateurs
                    </h1>
                    <button
                        onClick={handleCreate}
                        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        CRÉER
                    </button>
                </div>

                {/* Table */}
                <div className="bg-gray-800 rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-700 text-pink-500 font-semibold text-sm">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-3">EMAIL</div>
                        <div className="col-span-2">NOM</div>
                        <div className="col-span-2">PRÉNOM</div>
                        <div className="col-span-1">RÔLE</div>
                        <div className="col-span-1">COMMANDES</div>
                        <div className="col-span-2">ACTIONS</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-600">
                        {currentUsers.map((user) => {
                            const roleBadge = getRoleBadge(user.role);
                            return (
                                <div key={user.idUtilisateur} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-700 transition-colors items-center">
                                    <div className="col-span-1 text-sm font-medium">{user.idUtilisateur}</div>
                                    <div className="col-span-3 text-sm text-blue-400">{user.email}</div>
                                    <div className="col-span-2 font-semibold text-sm">{user.nom}</div>
                                    <div className="col-span-2 text-sm text-gray-300">{user.prenom}</div>
                                    <div className="col-span-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge.className}`}>
                                            {roleBadge.text}
                                        </span>
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <button
                                            onClick={() => handleViewCommands(user.idUtilisateur)}
                                            className="text-pink-500 hover:text-pink-300 font-medium text-sm underline"
                                        >
                                            {user.commandsCount}
                                        </button>
                                    </div>
                                    <div className="col-span-2 flex flex-col space-y-1">
                                        <button
                                            onClick={() => handleEdit(user.idUtilisateur)}
                                            className="text-pink-500 hover:text-white text-xs font-medium underline transition-colors text-left"
                                        >
                                            Modifier
                                        </button>
                                        {user.role !== 2 && (
                                            <button
                                                onClick={() => handleDelete(user.idUtilisateur)}
                                                className="text-red-400 hover:text-red-300 text-xs font-medium underline transition-colors text-left"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
                                    ? 'bg-pink-500 text-white'
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
                        <div className="text-2xl font-bold text-pink-500 mb-2">{users.length}</div>
                        <div className="text-gray-400">Total utilisateurs</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-pink-500 mb-2">
                            {users.filter(u => u.role === 1).length}
                        </div>
                        <div className="text-gray-400">Clients</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-pink-500 mb-2">
                            {users.filter(u => u.role === 2).length}
                        </div>
                        <div className="text-gray-400">Administrateurs</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-pink-500 mb-2">
                            {users.reduce((sum, u) => sum + u.commandsCount, 0)}
                        </div>
                        <div className="text-gray-400">Total commandes</div>
                    </div>
                </div>
            </div>
        </div>
    );
}