import {useContext, useState, useEffect} from "react";
import {ItemsContext} from "../../context/items-context/ItemsContext.jsx";
import { CheckCircle, AlertCircle } from "lucide-react";

function FeaturedCategory() {
    const {allItems, featuredCategory, setFeaturedCategory} = useContext(ItemsContext);
    const [selectedCategory, setSelectedCategory] = useState(featuredCategory);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'success' | 'error' | null

    useEffect(() => {
        const cats = ["all", ...new Set(allItems.map(item => item.category))];
        setCategories(cats);
        setSelectedCategory(featuredCategory);
    }, [allItems, featuredCategory]);

    const handleSave = async () => {
        setLoading(true);
        setFeedback(null);
        try {
            await setFeaturedCategory(selectedCategory);
            setFeedback('success');
            // Auto-dismiss after 3 seconds
            setTimeout(() => setFeedback(null), 3000);
        } catch (error) {
            console.error('Error saving:', error);
            setFeedback('error');
            setTimeout(() => setFeedback(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white max-w-md">
            <h2 className="text-xl font-bold mb-6">Featured Products Settings</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Select Category to Feature</label>
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-all"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                        Current: <span className="text-orange-500 font-bold">
                                    {
                                        !selectedCategory
                                            ? 'Loading...' : selectedCategory === 'all'
                                                ? 'All Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
                                    }
                                </span>
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="cursor-pointer w-full px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>

                {/* Feedback Messages */}
                {feedback === 'success' && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500 rounded-lg animate-in fade-in">
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                        <p className="text-sm text-green-200">Featured category saved successfully!</p>
                    </div>
                )}

                {feedback === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500 rounded-lg animate-in fade-in">
                        <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-200">Error saving featured category. Try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeaturedCategory;