import {useContext, useEffect, useState} from "react";
import AddItem from "./dashboardTabs/AddItem.jsx";
import ManageItems from "./dashboardTabs/ManageItems.jsx";
import FeaturedCategory from "./dashboardTabs/FeaturedCategory.jsx";
import ManageReviews from "./dashboardTabs/ManageReviews.jsx";
import {NavLink, useLoaderData, useNavigate} from "react-router-dom";
import {ItemsContext} from "../context/items-context/ItemsContext.jsx";
import {ReviewsContext} from "../context/reviews-context/ReviewsContext.jsx";
import ErrorModal from "../ui/modals/ErrorModal.jsx";
import { Home, Package, LogOut } from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const { items, reviews, featuredCategory, error } = useLoaderData();
    const { setItems, setFeaturedCategory } = useContext(ItemsContext);
    const { setReviews } = useContext(ReviewsContext);
    const [activeTab, setActiveTab] = useState('add');

    useEffect(() => {
        if (items) {
            setItems(items);
        }
        if (featuredCategory) {
            setFeaturedCategory(featuredCategory);
        }
        if (reviews) {
            setReviews(reviews);
        }
    }, [items, featuredCategory, reviews]);

    if (error) {
        return <ErrorModal
            title="Loader AdminDashboard error!"
            message={error.message}
            onClose={() => navigate("../")}
        />;
    }

    const handleLogout = () => {
        sessionStorage.removeItem("adminKey");
        navigate('/');
    };

    const tabs = [
        {id: "add", label: "Add Item"},
        {id: "manage", label: "Manage Items"},
        {id: "featured", label: "Featured Settings"},
        {id: "reviews", label: "Manage Reviews"}
    ];

    return (
        <div className="min-h-screen bg-black/30 p-2 md:p-8">
            {/* Header with Navigation */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>

            {/* Quick Navigation Buttons */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="flex flex-col sm:flex-row gap-3">
                    <NavLink
                        to='../'
                        className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-bold rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-lg"
                    >
                        <Home size={20} />
                        Home
                    </NavLink>
                    <NavLink
                        to='../products'
                        className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                    >
                        <Package size={20} />
                        Products
                    </NavLink>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-10">
                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8 border-b border-slate-700 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`cursor-pointer px-4 py-2 font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "text-orange-500 border-b-2 border-orange-500"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white/10 rounded-lg p-6">
                    {activeTab === "add" && <AddItem/>}
                    {activeTab === "manage" && <ManageItems/>}
                    {activeTab === "featured" && <FeaturedCategory/>}
                    {activeTab === "reviews" && <ManageReviews/>}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;