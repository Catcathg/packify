export default function HomePage() {
    return (
        <div className="min-h-screen font-inter">
            {/* Section Hero - Fond noir */}
            <section className="bg-black text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Titre principal */}
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 font-roboto">
                        Créez votre expérience unique
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 font-inter">
                        Choisissez un pack, composez vos activités et profitez à votre rythme.
                    </p>

                    {/* Image parachute */}
                    <div className="mb-12 flex justify-center">
                        <img
                            src="/assets/parachute_box.png"
                            alt="Parachute avec boîte cadeau"
                            className="w-48 h-48 md:w-64 md:h-64 object-contain"
                        />
                    </div>

                    {/* Bouton CTA */}
                    <button className="bg-packify-pink hover:bg-packify-pink-light text-white text-xl font-semibold px-12 py-4 rounded-full transition-colors duration-300 transform hover:scale-105">
                        DÉCOUVRIR
                    </button>
                </div>
            </section>

            {/* Section Comment ça marche - Fond marine */}
            <section className="bg-packify-navy text-white py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Titre section */}
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-roboto">
                        Comment ça marche
                    </h2>

                    {/* Étapes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Étape 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                                1
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-roboto">
                                Choisissez un pack
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Sélectionnez notre pack découverte
                            </p>
                        </div>

                        {/* Étape 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                                2
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-roboto">
                                Personnalisez
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Composez votre pack avec les activités qui vous plaisent
                            </p>
                        </div>

                        {/* Étape 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-packify-pink rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                                3
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-roboto">
                                Réservez
                            </h3>
                            <p className="text-gray-300 font-inter leading-relaxed">
                                Réservez votre pack et profitez le quand vous le voulez
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Notre pack - Fond noir */}
            <section className="bg-packify-black text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 font-roboto">
                        Notre pack
                    </h2>

                    {/* Card Pack Découverte */}
                    <div className="bg-white text-packify-black rounded-3xl p-8 max-w-md mx-auto">
                        {/* Image parachute dans la card */}
                        <div className="mb-6">
                            <img
                                src="/assets/parachute_box.png"
                                alt="Pack Découverte"
                                className="w-80 h-80 mx-auto object-contain"
                            />
                        </div>

                        <h3 className="text-2xl font-bold mb-2 font-roboto">
                            PACK DÉCOUVERTE
                        </h3>
                        <p className="text-gray-600 mb-6 font-inter">
                            3 activités au choix
                        </p>

                        <button className="bg-packify-pink hover:bg-packify-pink-light text-white px-8 py-3 rounded-full font-semibold transition-colors transition-colors duration-300 transform hover:scale-105">
                            69€
                        </button>
                    </div>
                </div>
            </section>

            {/* Section CTA finale - Fond noir */}
            <section className="bg-packify-black text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-roboto">
                        Prêt à créer votre expérience ?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 font-inter max-w-3xl mx-auto">
                        Créez des souvenirs inoubliables à votre rythme.  Notre pack s'adapte à vos envies et disponibilités, sans aucune limite de temps.
                    </p>

                    <button className="bg-packify-pink hover:bg-packify-pink-light text-white text-xl font-semibold px-12 py-4 rounded-full transition-colors duration-300 transform hover:scale-105">
                        DÉCOUVRIR
                    </button>
                </div>
            </section>
        </div>
    );
}
