import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useLogout } from "../hooks/useLogout";
import { useAuthUser } from "../firestore/firebaseAuth.js";

function MobileNavigation({ isVisible, isOpen, onOpenChange }) {
    const { logout } = useLogout();
    const { user, userName } = useAuthUser();

    const toggleMenu = () => onOpenChange(!isOpen);

    const closeMenu = () => {
        onOpenChange(false);
        window.scrollTo(0, 0);
    };


    const handleLogout = async () => {
        try {
            await logout();
            onOpenChange(false);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <header className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/70 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="flex items-center justify-between px-4 py-4">
                <NavLink
                    to="/"
                    className="text-sm font-bold text-white hover:text-secondary transition"
                    onClick={closeMenu}
                >
                    MakeThePrint
                </NavLink>

                <button
                    onClick={toggleMenu}
                    className="cursor-pointer text-white p-2 hover:bg-white/10 rounded-lg transition"
                >
                    {isOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-18 left-0 right-0 bg-black/80 backdrop-blur-3xl border-b border-white/10 py-4">
                    <nav className="flex flex-col gap-2 px-4">
                        <NavLink
                            to="/"
                            className={({isActive}) => isActive ? "text-secondary font-bold py-2" : "text-white hover:text-secondary transition py-2"}
                            onClick={closeMenu}
                        >
                            HOME
                        </NavLink>
                        <NavLink
                            to="about"
                            className={({isActive}) => isActive ? "text-secondary font-bold py-2" : "text-white hover:text-secondary transition py-2"}
                            onClick={closeMenu}
                        >
                            ABOUT
                        </NavLink>
                        <NavLink
                            to="products"
                            className={({isActive}) => isActive ? "text-secondary font-bold py-2" : "text-white hover:text-secondary transition py-2"}
                            onClick={closeMenu}
                        >
                            PRODUCTS
                        </NavLink>
                        <NavLink
                            to="order"
                            className={({isActive}) => isActive ? "text-secondary font-bold py-2" : "text-white hover:text-secondary transition py-2"}
                            onClick={closeMenu}
                        >
                            ORDER
                        </NavLink>

                        {user && (
                            <>
                                <div className="border-t border-white/20 my-2"></div>
                                <div className="text-white/90 font-semibold text-sm py-2">
                                    {userName}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition py-2"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        )}

                        {!user && (
                            <>
                                <div className="border-t border-white/20 my-2"></div>
                                <NavLink
                                    to="/login"
                                    className="text-white hover:text-secondary transition py-2"
                                    onClick={closeMenu}
                                >
                                    LOGIN
                                </NavLink>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default MobileNavigation;