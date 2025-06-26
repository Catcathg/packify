"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
    prenom: string;
    nom: string;
    email: string;
    mdp: string;
    confirmPassword: string;
}

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        prenom: '',
        nom: '',
        email: '',
        mdp: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const validateForm = (): boolean => {
        if (!formData.prenom || !formData.nom || !formData.email || !formData.mdp || !formData.confirmPassword) {
            setError('Veuillez remplir tous les champs');
            return false;
        }

        if (formData.mdp !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }

        if (formData.mdp.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return false;
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
        if (!passwordRegex.test(formData.mdp)) {
            setError('Le mot de passe doit contenir au moins une lettre, un chiffre et un symbole');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Veuillez saisir une adresse email valide');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            console.log('📝 Tentative d\'inscription...', {
                email: formData.email,
                prenom: formData.prenom,
                nom: formData.nom
            });

            const userData = {
                email: formData.email,
                mdp: formData.mdp,
                prenom: formData.prenom,
                nom: formData.nom
            };

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            console.log('📡 Statut de la réponse:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur du serveur:', errorText);
                throw new Error(errorText || `Erreur HTTP: ${response.status}`);
            }

            const message = await response.text();
            console.log('✅ Réponse du serveur:', message);

            setSuccess('Inscription réussie ! Redirection vers la connexion...');

            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);

        } catch (error) {
            console.error('❌ Erreur dans register:', error);

            if (error instanceof Error) {
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
                } else {
                    setError(error.message);
                }
            } else {
                setError('Une erreur inattendue s\'est produite');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
                {/* Toggle Buttons */}
                <div className="flex mb-8">
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-3 px-6 rounded-l-2xl font-medium transition-all ${
                            activeTab === 'register'
                                ? 'bg-black text-white'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        S'inscrire
                    </button>
                    <a
                        href="/auth/login"
                        className={`flex-1 py-3 px-6 rounded-r-2xl font-medium transition-all text-center ${
                            activeTab === 'login'
                                ? 'bg-black text-white'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        Se connecter
                    </a>
                </div>

                {/* Form Title */}
                <h1 className="text-2xl font-bold text-center mb-8 text-black font-roboto">
                    S'inscrire
                </h1>

                {/* Messages d'erreur/succès */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        ❌ {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        ✅ {success}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                name="prenom"  // Changé pour correspondre à l'entité
                                value={formData.prenom}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                                required
                                disabled={loading}
                                placeholder="Votre prénom"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom
                            </label>
                            <input
                                type="text"
                                name="nom"  // Changé pour correspondre à l'entité
                                value={formData.nom}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                                required
                                disabled={loading}
                                placeholder="Votre nom"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                            required
                            disabled={loading}
                            placeholder="votre@email.com"
                        />
                    </div>

                    {/* Password and Confirm Password */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="mdp"
                                value={formData.mdp}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                                required
                                disabled={loading}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmer
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-packify-pink focus:border-transparent transition-all"
                                required
                                disabled={loading}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Password Requirements */}
                    <p className="text-xs text-gray-500">
                        Utilisez 8 caractères ou plus avec un mélange de lettres, de chiffres et de symboles
                    </p>

                    {/* Show Password Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="w-4 h-4 text-packify-pink bg-gray-100 border-gray-300 rounded focus:ring-packify-pink focus:ring-2"
                            disabled={loading}
                        />
                        <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                            Afficher le mot de passe
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-bold py-4 px-6 rounded-full transition-all duration-300 text-lg ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-packify-pink hover:bg-packify-pink-light text-white transform hover:scale-105'
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                INSCRIPTION...
                            </div>
                        ) : (
                            'S\'INSCRIRE'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}