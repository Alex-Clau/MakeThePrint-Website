import {useContext, useState, useMemo} from "react";
import {ItemsContext} from "../../context/items-context/ItemsContext.jsx";
import {useNavigate} from "react-router-dom";
import ErrorModal from "../modals/ErrorModal.jsx";
import {Search, Grid3x3, List} from 'lucide-react';
import Item from "./Item.jsx";
import CompactItem from "./CompactItem.jsx";
import Dropdown from "./Dropdown.jsx";
import FeaturedCarousel from "../carousel/FeaturedCarousel.jsx";
import Pagination from "./Pagination.jsx";
import SearchBar from "./SearchBar.jsx";
import {useFilteredItems} from "../../hooks/useFilteredItems.js";

const SORT_OPTIONS = [{value: "none", label: "No sort"}, {
    value: "price-asc",
    label: "Price: Low to High"
}, {value: "price-desc", label: "Price: High to Low"}];
const ITEMS_PER_PAGE = 10;
const VIEW_MODES = [['grid', <Grid3x3 key="grid" size={20}/>], ['list', <List key="list" size={20}/>]];
const SEARCH_DEBOUNCE_MS = 300;

function Products() {
    const [filters, setFilters] = useState({
        category: 'all',
        favorites: false,
        search: '',
        sort: 'none',
        page: 1,
        viewMode: 'grid'
    });

    const {allItems, favoriteItems, error} = useContext(ItemsContext);
    const navigate = useNavigate();
    const categories = useMemo(() => !allItems.length ? ["all"] : ["all", ...new Set(allItems.map(item => item.category))], [allItems]);

    const updateFilter = (key, value) => setFilters(f => ({...f, [key]: value, page: 1}));
    const updatePage = (page) => setFilters(f => ({...f, page}));

    let filtered = filters.category === "all" ? allItems : allItems.filter(item => item.category === filters.category);
    filtered = filters.favorites ? filtered.filter(item => favoriteItems.some(fav => fav.id === item.id)) : filtered;

    const searchedItems = useFilteredItems(filtered, favoriteItems, filters.category, filters.search, filters.sort);
    const totalPages = Math.ceil(searchedItems.length / ITEMS_PER_PAGE);
    const paginatedItems = searchedItems.slice((filters.page - 1) * ITEMS_PER_PAGE, filters.page * ITEMS_PER_PAGE);

    return (
        <>
            <div className="pt-15 sticky top-0 backdrop-blur-md bg-slate-900/70 border-b border-white/10 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-[slide-down-fade-in_0.7s_ease-out]">
                        Browse <span className="text-secondary">Products</span>
                    </h1>

                    <div className="mb-6">
                        <SearchBar value={filters.search} onChange={(val) => updateFilter('search', val)}/>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <Dropdown options={categories} selected={filters.category}
                                      onChange={(cat) => updateFilter('category', cat)}
                                      getLabel={(cat) => cat === "all" ? "All Products" : cat.charAt(0).toUpperCase() + cat.slice(1)}/>
                            <button onClick={() => updateFilter('favorites', !filters.favorites)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filters.favorites ? "bg-secondary text-blue-900 shadow-lg" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"}`}>
                                Favorites
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
                                    className="px-3 py-2 rounded-lg appearance-none bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-secondary focus:bg-white/15 transition-all cursor-pointer">
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}
                                            style={{backgroundColor: '#1e293b', color: '#fff'}}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2 bg-white/10 p-1 rounded-lg border border-white/20">
                                {VIEW_MODES.map(([mode, icon]) => (
                                    <button key={mode} onClick={() => updateFilter('viewMode', mode)}
                                            className={`p-2 rounded transition-all ${filters.viewMode === mode ? 'bg-white/20 text-secondary' : 'text-white/60 hover:text-white'}`}>{icon}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-white mb-8">Featured Products</h2>
                <FeaturedCarousel/>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 products-section">
                <h2 className="text-3xl font-bold text-white mb-8">All Products</h2>
                {searchedItems.length > 0 ? (
                    <>
                        <div
                            className={filters.viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" : "space-y-3"}>
                            {paginatedItems.map(item => (
                                <div
                                    key={`${item.id}-${filters.page}-${filters.viewMode}-${filters.category}-${filters.favorites}-${filters.search}`}>
                                    {filters.viewMode === 'grid' ? <Item {...item} /> : <CompactItem {...item} />}
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 &&
                            <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={updatePage}/>}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4 opacity-30">📭</div>
                        <p className="text-white/50 text-xl">{filters.favorites ? 'No favorite items yet' : 'No products found'}</p>
                    </div>
                )}
            </div>

            {error && <ErrorModal title={error.title} message={error.message} onClose={() => navigate("../")}/>}
        </>
    );
}

export default Products;