import {NavLink} from "react-router-dom";

function HomePage() {
    return (
        <div className="relative w-full top-0 min-h-screen bg-black/20 flex flex-col items-center justify-center">

            {/* Mid Page Text */}
            <div className="text-center px-6 mb-16 relative z-10">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg mb-4 animate-fade-in">
                    Make your story.
                </h1>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
                    MakeThePrint.
                </h2>

                <p className="text-white/70 text-sm sm:text-base mt-6 font-light tracking-wide">
                    Bring your imagination to life with beautifully printed products.
                </p>
            </div>

            {/* To Products Button */}
            <NavLink
                to='products'
                className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-105 mb-16 no-underline relative z-10">
                Explore Our Products
            </NavLink>

        </div>
    );
}

export default HomePage;