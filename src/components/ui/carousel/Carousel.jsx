import {useState, useEffect} from "react";
import {ChevronLeft, ChevronRight} from 'lucide-react';

function Carousel({items, itemsPerSlide = 3, renderItem, mobileItemWidth = 32}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [isMedium, setIsMedium] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsMedium(width >= 768 && width < 1024);
        };
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Handle responsive itemsPerSlide
    const getItemsPerSlide = () => {
        if (typeof itemsPerSlide === 'object') {
            if (isMobile) return itemsPerSlide.mobile || 1;
            if (isMedium) return itemsPerSlide.md || 2;
            return itemsPerSlide.desktop || 3;
        }
        return itemsPerSlide;
    };

    const currentItemsPerSlide = getItemsPerSlide();
    const totalSlides = Math.ceil(items.length / currentItemsPerSlide);
    const currentItems = items.slice(currentIndex * currentItemsPerSlide, (currentIndex + 1) * currentItemsPerSlide);

    const next = () => setCurrentIndex((currentIndex + 1) % totalSlides);
    const prev = () => setCurrentIndex((currentIndex - 1 + totalSlides) % totalSlides);

    // Reset index if it exceeds new total slides after resize
    useEffect(() => {
        if (currentIndex >= totalSlides) {
            setCurrentIndex(0);
        }
    }, [totalSlides, currentIndex]);

    if (items.length === 0) return null;

    return (
        <>
            {/* Mobile Horizontal Scroll */}
            {isMobile && (
                <div className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-2 p-2">
                    {items.map((item, idx) => (
                        <div key={idx} className={`flex-shrink-0 w-${mobileItemWidth} animate-slide-in`}>
                            {renderItem(item, 'mobile')}
                        </div>
                    ))}
                </div>
            )}

            {/* Desktop/Tablet Carousel */}
            {!isMobile && (
                <div className="relative w-full rounded-lg group min-h-48 md:min-h-56 flex items-center overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-6 px-16 md:px-16 p-3 md:p-8 w-full">
                        {currentItems.map((item, idx) => (
                            <div
                                key={`${currentIndex}-${idx}`}
                                className="flex-1 animate-slide-in"
                            >
                                {renderItem(item, 'desktop')}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                        <ChevronLeft size={24} className="text-white"/>
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                        <ChevronRight size={24} className="text-white"/>
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {Array.from({length: totalSlides}).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    i === currentIndex ? 'bg-secondary w-6' : 'bg-white/50 hover:bg-white/70'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Carousel;