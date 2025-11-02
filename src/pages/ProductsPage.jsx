import {useLoaderData, useNavigate} from 'react-router-dom';
import {useEffect, useContext} from "react";
import {ItemsContext} from "../components/context/items-context/ItemsContext.jsx";
import Products from "../components/ui/products/Products.jsx";
import ErrorModal from "../components/ui/modals/ErrorModal.jsx";

function ProductsPage() {
    const navigate = useNavigate();
    const { items, featuredCategory, error, favorites } = useLoaderData();
    const { setItems, setFeaturedCategory, setFavorites } = useContext(ItemsContext);

    useEffect(() => {
        if (items) {
            setItems(items);
        }
        if (featuredCategory) {
            setFeaturedCategory(featuredCategory);
        }
        if(favorites) {
            setFavorites(favorites)
        }
    }, [items, featuredCategory, favorites]);

    if (error) {
        return <ErrorModal
            title="Loader ProductsPage error!"
            message={error.message}
            onClose={() => navigate("../")}
        />;
    }

    return <div className="w-full min-h-screen bg-black/20 overflow-y-auto">
        <Products />
    </div>;
}

export default ProductsPage;