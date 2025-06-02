import React from 'react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Dashboard
                    </h1>
                </div>

                {/* Dashboard Cards */}
                <div className="space-y-6">
                    {/* Packs Card */}
                    <div className="bg-packify-navy rounded-3xl p-8 hover:bg-opacity-80 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold font-roboto group-hover:text-packify-pink transition-colors">
                                Packs
                            </h2>
                            <div className="w-16 h-16 bg-packify-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Activities Card */}
                    <div className="bg-packify-navy rounded-3xl p-8 hover:bg-opacity-80 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold font-roboto group-hover:text-packify-pink transition-colors">
                                Activités
                            </h2>
                            <div className="w-16 h-16 bg-packify-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional: Add some relevant stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">12</div>
                        <div className="text-gray-400">Activités disponibles</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-2xl font-bold text-packify-pink mb-2">247</div>
                        <div className="text-gray-400">Packs vendus</div>
                    </div>
                </div>
            </div>
        </div>
    );
}