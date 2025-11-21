"use client";

import { useEffect, useState } from "react";

interface Drink {
    id: string;
    brand: string;
    price: number;
    image: string;
}

export default function DrinksPage() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/v1/drinks", {
                    credentials: "include", // important si cookies/JSESSIONID
                });

                if (!res.ok) {
                    throw new Error(`Erreur ${res.status}`);
                }

                const data = await res.json();
                setDrinks(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrinks();
    }, []);

    if (loading) return <p>Chargement des boissons...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Nos Drinks</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {drinks.map((drink) => (
                    <div
                        key={drink.id}
                        className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                    >
                        <img
                            src={drink.image}
                            alt={drink.brand}
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                        <h2 className="text-xl font-semibold">{drink.brand}</h2>
                        <p className="text-gray-700">Prix : {drink.price} €</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
