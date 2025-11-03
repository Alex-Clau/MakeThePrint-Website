import { NavLink, useLocation } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";
import {memo, useEffect} from "react";
import useScrollToElement from "../hooks/useScrollToElement.js";

function Footer() {
    const currentYear = new Date().getFullYear();
    const location = useLocation();
    const scrollToOrder = useScrollToElement('order');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);


    const handleNavClick = (path) => (e) => {
        if (location.pathname === path) {
            e.preventDefault(); // on the page already! and stops navigation
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        // useEffect will scroll after navigation
    };

    return (
        <footer className="bg-slate-900/70 backdrop-blur-md border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Make<span className="text-secondary">ThePrint</span>
                        </h3>
                        <p className="text-white/60 text-sm">
                            Bringing imagination to life through quality printing.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Navigation</h4>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li>
                                <NavLink
                                    to="/"
                                    onClick={handleNavClick('/')}
                                    className="hover:text-secondary transition"
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/products"
                                    onClick={handleNavClick('/products')}
                                    className="hover:text-secondary transition"
                                >
                                    Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    onClick={handleNavClick('/about')}
                                    className="hover:text-secondary transition"
                                >
                                    About
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Contact</h4>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li>
                                <button
                                    onClick={scrollToOrder}
                                    className="hover:text-secondary transition cursor-pointer bg-none border-none p-0"
                                >
                                    Place an Order
                                </button>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                <a href="mailto:contact@maketheprint.shop" className="hover:text-secondary transition">
                                    contact@maketheprint.shop
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a target='_blank' href="https://www.instagram.com/maketheprint?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-white/60 hover:text-secondary transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-white/60 hover:text-secondary transition">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
                    <p>&copy; {currentYear} MakeThePrint. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default memo(Footer);