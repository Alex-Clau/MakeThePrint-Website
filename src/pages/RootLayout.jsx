import MainNavigation from "../components/navigation/MainNavigation.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/navigation/Footer.jsx";

function RootLayout() {
    return (
        <div className="relative min-h-screen">
            <MainNavigation />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default RootLayout;
