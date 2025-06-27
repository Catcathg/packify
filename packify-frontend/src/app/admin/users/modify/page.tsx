"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface User {
    idUtilisateur: number;
    email: string;
    nom: string;
    prenom: string;
    role: number;
}

export default function UserModify() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/utilisateurs/findById?id=${userId}`);
                if (!response.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser((prev) => prev ? { ...prev, [name]: name === "role" ? parseInt(value) : value } : null);
        setError(null);
        setSuccess(null);
    };

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("http://localhost:8080/api/v1/utilisateurs/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

            setSuccess("Modifications enregistrées !");
            setTimeout(() => router.push("/admin/users"), 1500);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-inter">
                <p>Chargement de l'utilisateur...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-inter">
                <p>Utilisateur introuvable</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold font-roboto border-b-2 border-pink-500 pb-2 mb-8">
                    Modifier l'utilisateur
                </h1>

                {error && <div className="mb-6 bg-red-900/30 border border-red-500 text-red-400 rounded-lg p-4">{error}</div>}
                {success && <div className="mb-6 bg-green-900/30 border border-green-500 text-green-400 rounded-lg p-4">{success}</div>}

                <div className="space-y-6">
                    <input
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Email"
                    />
                    <input
                        name="nom"
                        value={user.nom}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Nom"
                    />
                    <input
                        name="prenom"
                        value={user.prenom}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Prénom"
                    />
                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        <option value={0}>Administrateur</option>
                        <option value={1}>Client</option>
                    </select>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-md transition-all duration-300 disabled:opacity-50"
                        >
                            {saving ? "Enregistrement..." : "Sauvegarder"}
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="text-gray-400 hover:text-white font-medium px-4 py-2"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
