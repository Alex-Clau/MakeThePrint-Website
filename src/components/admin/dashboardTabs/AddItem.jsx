import { useContext, useState } from "react";
import { ItemsContext } from "../../context/items-context/ItemsContext.jsx";
import AdminInputsForm from "../ui/AdminInputsForm.jsx";
import ItemPreview from "../ui/ItemPreview.jsx";

const INITIAL_FORM_DATA = {
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
};

function AddItem() {
    const { addItem } = useContext(ItemsContext);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadSuccess = (result) => {
        const cloudinaryUrl = result.info.secure_url;
        setFormData(prev => ({
            ...prev,
            image: cloudinaryUrl
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.image) {
            alert('Please upload an image first');
            return;
        }

        const item = {
            name: formData.name,
            price: formData.price,
            id: `PROD-${Date.now().toString().slice(-6)}`,
            description: formData.description,
            category: formData.category,
            like: false,
            image: formData.image,
        };

        addItem(item);

        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <AdminInputsForm
                    formData={formData}
                    handleChange={handleChange}
                    onUploadSuccess={handleUploadSuccess}
                />

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="cursor-pointer flex-1 px-4 py-2 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-all"
                    >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    <button
                        type="submit"
                        className="cursor-pointer flex-1 px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all"
                    >
                        Add Item
                    </button>
                </div>
            </form>

            {/* Live Preview */}
            {showPreview && (
                <ItemPreview formData={formData} />
            )}
        </div>
    );
}

export default AddItem;