'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const [nbUsers, setNbUsers] = useState(0);
    const [nbPacks, setNbPacks] = useState(0);
    const [nbActivites, setNbActivites] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Utilisateurs
                const resUsers = await fetch("http://localhost:8080/api/v1/utilisateurs/getAll");
                if (resUsers.ok) {
                    const dataUsers = await resUsers.json();
                    setNbUsers(dataUsers.length);
                }

                // 2. Commandes
                const resCmd = await fetch("http://localhost:8080/api/v1/commandes/getAll");
                if (resCmd.ok) {
                    const dataCmd = await resCmd.json();
                    setNbPacks(dataCmd.length);
                }

                // 3. Activités
                const resActs = await fetch("http://localhost:8080/api/v1/activities/getAll");
                if (resActs.ok) {
                    const dataActs = await resActs.json();
                    setNbActivites(dataActs.length);
                }

            } catch (err) {
                console.error("Erreur lors du chargement des statistiques :", err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-pink-500 pb-2 inline-block">
                        Dashboard
                    </h1>
                </div>

                {/* Dashboard Cards */}
                <div className="space-y-6">
                    {/* Packs Card */}
                    <Link href="/admin/packs" className="block">
                        <div
                            className="bg-gray-800 rounded-3xl p-8 hover:bg-opacity-80 transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold font-roboto group-hover:text-pink-500 transition-colors">
                                    Packs
                                </h2>
                                <div
                                    className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Activities Card */}
                    <Link href="/admin/activities" className="block">
                        <div
                            className="bg-gray-800 rounded-3xl p-8 hover:bg-opacity-80 transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold font-roboto group-hover:text-pink-500 transition-colors">
                                    Activités
                                </h2>
                                <div
                                    className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Users Card */}
                    <Link href="/admin/users" className="block">
                        <div
                            className="bg-gray-800 rounded-3xl p-8 hover:bg-opacity-80 transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold font-roboto group-hover:text-pink-500 transition-colors">
                                    Utilisateurs
                                </h2>
                                <div
                                    className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-pink-500 mb-2">{nbActivites}</div>
                        <div className="text-gray-400">Activités disponibles</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-pink-500 mb-2">{nbPacks}</div>
                        <div className="text-gray-400">Packs vendus</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-pink-500 mb-2">{nbUsers}</div>
                        <div className="text-gray-400">Utilisateurs inscrits</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
