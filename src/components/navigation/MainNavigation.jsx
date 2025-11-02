import { useState, useEffect, useRef } from "react";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

function MainNavigation() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY.current) {
                setIsVisible(true);
            } else if (currentScrollY > 100) {
                setIsVisible(false);
            }

            // close the mobile menu when scrolling
            if (isMobileMenuOpen && currentScrollY > lastScrollY.current) {
                setIsMobileMenuOpen(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobileMenuOpen]);

    return (
        <>
            <DesktopNavigation isVisible={isVisible} />
            <MobileNavigation
                isVisible={isVisible}
                isOpen={isMobileMenuOpen}
                onOpenChange={setIsMobileMenuOpen}
            />
        </>
    );
}

export default MainNavigation;