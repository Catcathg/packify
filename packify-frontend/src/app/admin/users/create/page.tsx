"use client";
import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface UserData {
    email: string;
    nom: string;
    prenom: string;
    mdp: string;
    role: number;
}

export default function CreateUser() {
    const router = useRouter();

    const [userData, setUserData] = useState<UserData>({
        email: "",
        nom: "",
        prenom: "",
        mdp: "",
        role: 1
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: name === "role" ? parseInt(value) : value
        }));
        setError(null);
        setSuccess(null);
    };

    const handleSave = async () => {
        if (!userData.email || !userData.nom || !userData.prenom || !userData.mdp) {
            setError("Tous les champs sont requis.");
            return;
        }

        try {
            setSaving(true);
            const response = await fetch("http://localhost:8080/api/v1/utilisateurs/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error("Erreur lors de la création de l'utilisateur");

            setSuccess("Utilisateur créé avec succès !");
            setTimeout(() => router.push("/admin/users"), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-3xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-roboto border-b-2 border-packify-pink pb-2 inline-block">
                        Utilisateurs
                    </h1>
                    <p className="text-packify-pink font-semibold mt-4 text-lg">
                        CRÉER UN NOUVEL UTILISATEUR
                    </p>
                </div>

                {/* Error / Success messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-400 font-semibold">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-400 font-semibold">
                        {success}
                        <p className="text-green-300 text-sm mt-1">Redirection en cours...</p>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-white font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            disabled={saving}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-packify-pink disabled:opacity-50"
                            placeholder="Email"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white font-medium mb-2">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={userData.nom}
                                onChange={handleChange}
                                disabled={saving}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-packify-pink disabled:opacity-50"
                                placeholder="Nom"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={userData.prenom}
                                onChange={handleChange}
                                disabled={saving}
                                className="w-full px-4 py-3 bg-transparent border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-packify-pink disabled:opacity-50"
                                placeholder="Prénom"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-white font-medium mb-2">Mot de passe</label>
                        <input
                            type="password"
                            name="mdp"
                            value={userData.mdp}
                            onChange={handleChange}
                            disabled={saving}
                            className="w-full px-4 py-3 bg-transparent border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-packify-pink disabled:opacity-50"
                            placeholder="Mot de passe"
                        />
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            onClick={() => router.back()}
                            disabled={saving}
                            className="px-6 py-3 rounded-full bg-gray-700 hover:bg-gray-600 font-bold transition-all disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 rounded-full bg-packify-pink hover:bg-packify-pink-light font-bold transition-all transform hover:scale-105 disabled:opacity-50"
                        >
                            {saving ? "Création..." : "Créer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
