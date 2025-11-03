import MainNavigation from "../components/navigation/MainNavigation.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/navigation/Footer.jsx";
import { Helmet } from "react-helmet";

function RootLayout() {
    return (
        <>
            <Helmet>
                <title>MakeThePrint – 3D Models Online Store</title>
                <meta name="description" content="Browse, favorite, and order 3D models at MakeThePrint. Small business SPA with admin dashboard and responsive design." />
                <meta name="keywords" content="MakeThePrint, 3D models, 3D printing, order 3D models, SPA, React, Firebase" />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="relative min-h-screen">
                <MainNavigation />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
}

export default RootLayout;
