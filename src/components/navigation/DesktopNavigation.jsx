import { NavLink } from "react-router-dom";
import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useLogout } from "../hooks/useLogout";
import { useAuthUser } from "../firestore/firebaseAuth.js";

function DesktopNavigation({ isVisible }) {
    const { logout } = useLogout();
    const { user, userName, loading } = useAuthUser();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setShowUserMenu(false);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (!isVisible) return null;

    return (
        <header className="hidden md:fixed md:top-4 md:left-1/2 md:-translate-x-1/2 md:z-50 md:block">
            <div className="flex items-center gap-8 font-bold text-white rounded-2xl px-6 py-3 bg-gray-900/30 backdrop-blur-md border border-white/20 shadow-lg hover:bg-blue-900/50 transition-all">
                <NavLink
                    to="products"
                    onClick={() => window.scrollTo(0, 0)}
                    className={({isActive}) => isActive ? "text-secondary text-sm" : "hover:text-secondary transition text-sm"}
                >
                    Products
                </NavLink>

                <span className="text-white/30">|</span>

                <NavLink
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className={({isActive}) => isActive ? "text-secondary text-sm" : "hover:text-secondary transition text-sm"}
                >
                    Home
                </NavLink>

                <span className="text-white/30">|</span>

                <NavLink
                    to="about"
                    onClick={() => window.scrollTo(0, 0)}
                    className={({isActive}) => isActive ? "text-secondary text-sm" : "hover:text-secondary transition text-sm"}
                >
                    About
                </NavLink>

                <span className="text-white/30">|</span>

                <NavLink
                    to="order"
                    onClick={() => window.scrollTo(0, 0)}
                    className={({isActive}) => isActive ? "text-secondary text-sm" : "hover:text-secondary transition text-sm"}
                >
                    Order
                </NavLink>

                {user && (
                    <>
                        <span className="text-white/30">|</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 text-sm hover:text-secondary transition"
                            >
                                <User size={18} />
                                {userName}
                            </button>

                            {showUserMenu && (
                                <div className="absolute top-10 right-0 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-2 min-w-max">
                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer flex items-center gap-2 px-3 py-2 text-red-400 hover:text-white hover:bg-red-500/90 rounded-lg transition-all text-sm"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {!loading && !user && (
                    <>
                        <span className="text-white/30">|</span>
                        <NavLink
                            to="/login"
                            onClick={() => window.scrollTo(0, 0)}
                            className="text-sm hover:text-secondary transition"
                        >
                            Login
                        </NavLink>
                    </>
                )}
            </div>
        </header>
    );
}

export default DesktopNavigation;