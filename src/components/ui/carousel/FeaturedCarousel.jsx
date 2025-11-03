import {useContext, useState, useMemo} from "react";
import {ItemsContext} from "../../context/items-context/ItemsContext.jsx";
import ModalItemDetails from "../modals/ModalItemDetails.jsx";
import Carousel from "./Carousel.jsx";

function FeaturedCarousel() {
    const [selectedItemId, setSelectedItemId] = useState(null);
    const {allItems, featuredCategory} = useContext(ItemsContext);

    const featuredItems = useMemo(() => {
        return (featuredCategory === 'all'
                ? allItems
                : allItems.filter(item => item.category === featuredCategory)
        ).slice(0, 9);
    }, [allItems, featuredCategory]);

    const renderItem = (item, view) => {
        if (view === 'mobile') {
            return (
                <div className="flex flex-col gap-2">
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg" />
                    <p className="text-white/80 text-xs">${item.price}</p>
                    <button onClick={() => setSelectedItemId(item.id)} className="px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-md text-s transition-all">
                        Details
                    </button>
                </div>
            );
        }
        return (
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center rounded-lg">
                <img src={item.image} alt={item.name} className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-base md:text-2xl font-bold text-white mb-1 md:mb-2">{item.name}</h3>
                    <button onClick={() => setSelectedItemId(item.id)} className="px-4 md:px-6 py-1 md:py-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all w-fit text-sm md:text-base">
                        Details
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <Carousel items={featuredItems} itemsPerSlide={{ mobile: 1, md: 2, desktop: 3 }} renderItem={renderItem} />
            {selectedItemId && (
                <ModalItemDetails
                    showModal={true}
                    setShowModal={() => setSelectedItemId(null)}
                    itemId={selectedItemId}
                />
            )}
        </>
    );
}

export default FeaturedCarousel;