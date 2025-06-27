"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    email?: string;
    nom?: string;
    role?: string;
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [cartLoading, setCartLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);

    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || localStorage.getItem('authToken');
        }
        return null;
    };

    const isUserAuthenticated = () => {
        const token = getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp > currentTime;
        } catch (error) {
            console.error('Token invalide:', error);
            return false;
        }
    };

    const fetchUserProfile = async () => {
        try {
            const token = getToken();
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setAuthLoading(false);
                return;
            }

            // Vérifier si le token est valide
            if (!isUserAuthenticated()) {
                console.log('Token expiré, nettoyage...');
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
                setUser(null);
                setAuthLoading(false);
                return;
            }

            // Récupérer les données utilisateur depuis localStorage
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    console.log('Données utilisateur depuis localStorage:', userData);
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (e) {
                    console.error('Erreur lors du parsing des données utilisateur:', e);
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                console.log('Aucune donnée utilisateur dans localStorage');
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setAuthLoading(false);
        }
    };

    const fetchCartCount = async () => {
        try {
            if (typeof window !== 'undefined') {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const cartData = JSON.parse(savedCart);
                    setCartCount(cartData?.length || 0);
                } else {
                    setCartCount(0);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du panier:', error);
            setCartCount(0);
        } finally {
            setCartLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = () => {
            if (typeof window !== 'undefined') {
                const authenticated = isUserAuthenticated();
                if (authenticated) {
                    fetchUserProfile();
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    setAuthLoading(false);
                }
            }
        };

        checkAuth();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' || e.key === 'authToken' || e.key === 'user') {
                checkAuth();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }
    }, [pathname]);

    useEffect(() => {
        fetchCartCount();

        const handleCartChange = (e: StorageEvent) => {
            if (e.key === 'cart') {
                fetchCartCount();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleCartChange);
            return () => window.removeEventListener('storage', handleCartChange);
        }
    }, [pathname]);

    useEffect(() => {
        const interval = setInterval(fetchCartCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogin = () => {
        setIsMenuOpen(false);
        router.push('/auth/login');
    };

    const handleRegister = () => {
        setIsMenuOpen(false);
        router.push('/auth/register');
    };

    const handleLogout = async () => {
        try {
            // Pas d'appel API pour le logout, juste nettoyage localStorage
            console.log('Déconnexion en cours...');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer le localStorage dans tous les cas
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Réinitialiser les états
            setIsAuthenticated(false);
            setUser(null);
            setIsMenuOpen(false);
            setCartCount(0);

            // Rediriger vers l'accueil
            router.push('/');
        }
    };

    const handleProfile = () => {
        setIsMenuOpen(false);
        if (user?.role === 'ADMIN' || user?.role === 'admin') {
            router.push('/admin/profile');
        } else {
            router.push('/profile');
        }
    };

    const handleCartClick = () => {
        fetchCartCount();
        router.push('/cart');
    };

    return (
        <header className="bg-black text-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
                            Packify
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Navigation principale */}
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a href="/"
                               className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                ACCUEIL
                            </a>
                        </div>

                        {/* Boutons de connexion */}
                        <div className="flex items-center space-x-4">
                            {/* Bouton Panier avec compteur */}
                            <button
                                onClick={handleCartClick}
                                className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center h-12 transform hover:scale-105 relative"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z"/>
                                </svg>
                                {!cartLoading && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                                {cartLoading && (
                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    </span>
                                )}
                            </button>

                            {/* Menu déroulant utilisateur */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={toggleMenu}
                                    className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-3 h-12 focus:outline-none focus:ring-2 focus:ring-pink-300 transform hover:scale-105"
                                >
                                    {/* Menu hamburger animé */}
                                    <div className="flex flex-col space-y-1">
                                        <div className={`w-4 h-0.5 bg-white rounded transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                                        <div className={`w-4 h-0.5 bg-white rounded transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                                        <div className={`w-4 h-0.5 bg-white rounded transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                                    </div>

                                    {/* Avatar circulaire */}
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                        {authLoading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-400"></div>
                                        ) : isAuthenticated && user ? (
                                            <span className="text-pink-400 font-bold text-sm">
                                                {user.email ? user.email.charAt(0).toUpperCase() : user.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        ) : (
                                            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                        )}
                                    </div>
                                </button>

                                {/* Menu déroulant */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                                        <div className="py-2">
                                            {isAuthenticated ? (
                                                <>
                                                    {/* Utilisateur connecté */}
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Connecté en tant que
                                                        </p>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {user?.email || user?.nom || 'Utilisateur'}
                                                        </p>
                                                        {user?.role && (
                                                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                                                user.role === 'ADMIN' || user.role === 'admin'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {user.role.toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={handleProfile}
                                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                        </svg>
                                                        <span>Mon profil</span>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            handleCartClick();
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z"/>
                                                            </svg>
                                                            <span>Mon panier</span>
                                                        </div>
                                                        {!cartLoading && cartCount > 0 && (
                                                            <span className="bg-pink-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                                {cartCount}
                                                            </span>
                                                        )}
                                                    </button>

                                                    {(user?.role === 'ADMIN' || user?.role === 'admin' || user?.role === 0) && (
                                                        <button
                                                            onClick={() => {
                                                                setIsMenuOpen(false);
                                                                router.push('/admin/dashboard');
                                                            }}
                                                            className="w-full text-left px-4 py-3 text-sm text-indigo-700 hover:bg-indigo-50 flex items-center space-x-3 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                                                            </svg>
                                                            <span>Dashboard admin</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                                        </svg>
                                                        <span>Se déconnecter</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Bienvenue sur Packify
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Connectez-vous pour accéder à votre compte
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            handleCartClick();
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z"/>
                                                            </svg>
                                                            <span>Mon panier</span>
                                                        </div>
                                                        {!cartLoading && cartCount > 0 && (
                                                            <span className="bg-pink-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                                {cartCount}
                                                            </span>
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={handleLogin}
                                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                                                        </svg>
                                                        <span>Se connecter</span>
                                                    </button>

                                                    <button
                                                        onClick={handleRegister}
                                                        className="w-full text-left px-4 py-3 text-sm text-pink-600 hover:bg-pink-50 flex items-center space-x-3 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                                        </svg>
                                                        <span>S'inscrire</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}